import type { NextApiRequest, NextApiResponse } from "next"
import multer from "multer"
import nextConnect from "next-connect"

// Multerのインスタンスを提供する
// mulutipart/form-data形式でアップロードされたファイルを処理するミドルウェア
const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

/*
    Next-Connect: メソッドベースでAPIが書けるようになるミドルウェア
 */
const apiRoute = nextConnect({
    onError(error: any, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `:( Sorry something Happend! ${error.message}` })
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(405).json({ error: `Method ${req.method} Not Allowed.` })
    }
})

const uploadMiddleware = upload.array('theFiles')

// Mext-Connect にミドルウェアを追加
apiRoute.use(uploadMiddleware)

apiRoute.post((req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ data: "success" })
})

export default apiRoute

export const config = {
    api: {
        bodyParser: false
    }
}
