import type { NextApiRequest, NextApiResponse } from "next"
import multer from "multer"
import nextConnect from "next-connect"
import { readdirSync } from "fs"
import {
  UPLOAD_FILE_FORM_FIELD_NAME,
  UPLODED_FILE_DESTINATION_PATH,
} from "../../../const/const"

// Multerのインスタンスを提供する
// Multer: mulutipart/form-data形式でアップロードされたファイルを処理するミドルウェア
const upload = multer({
  limits: {
    files: 1,
  },
  storage: multer.diskStorage({
    destination: UPLODED_FILE_DESTINATION_PATH,
    // FIXME: 日本語のファイルアップロードすると文字化けする
    filename: (_req, file, cb) => cb(null, file.originalname),
  }),
})

/*
    Next-Connect: メソッドベースでAPIが書けるようになるミドルウェア
 */
const apiRoute = nextConnect({
  onError(error: any, _req: NextApiRequest, res: NextApiResponse) {
    res
      .status(500)
      .json({ error: `:( Sorry something Happend! ${error.message}` })
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(404).json({ error: `Method ${req.method} Not Allowed.` })
  },
})

apiRoute.use(upload.single(UPLOAD_FILE_FORM_FIELD_NAME))

// ファイルPOST時
apiRoute.post((_req, res) => {
  // TODO: 保存時にファイル名を一意に、成功時ファイル名とURLを返却するようにする
  res.status(200)
})

export default apiRoute

// このAPIではファイルの受け渡しに使うため、Bodyへのパースを無効化
export const config = {
  api: {
    bodyParser: false,
  },
}
