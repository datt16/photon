import { createHash } from "crypto"
import multer from "multer"
import type { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import { photonConst } from "../../../const/const"

// Multerのインスタンスを提供する
// Multer: mulutipart/form-data形式でアップロードされたファイルを処理するミドルウェア
const upload = multer({
  limits: {
    files: 1,
  },
  storage: multer.diskStorage({
    destination: photonConst.UPLOADED_FILE_DESTINATION_PATH,
    filename: (_req, file, cb) => {
      const [fileName, fileType] = file.originalname.split(".")
      cb(
        null,
        `${createHash("sha1").update(fileName).digest("hex")}.${fileType}`
      )
    },
  }),
})

/*
    Next-Connect: メソッドベースでAPIが書けるようになるミドルウェア
 */
const apiRoute = nextConnect({
  onError(error: unknown, _req: NextApiRequest, res: NextApiResponse) {
    res.status(500).json({ error: `:( Sorry something Happened!` })
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(404).json({ error: `Method ${req.method} Not Allowed.` })
  },
})

// ファイルPOST時
apiRoute.post(
  upload.single(photonConst.UPLOAD_FILE_FORM_FIELD_NAME),
  (req, res) => {
    const fileData = req.file
    res.status(200).json({
      fileName: fileData?.filename,
      folderPath: fileData?.destination.split("./public")[1] + "/",
    })
    res.end()
  }
)

export default apiRoute

// このAPIではファイルの受け渡しに使うため、Bodyへのパースを無効化
export const config = {
  api: {
    bodyParser: false,
  },
}
