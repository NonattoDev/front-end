import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { s3 } from "@/services/s3BackBlaze";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // Desativa o bodyParser padrão do Next.js para permitir que o multer processe o corpo
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    upload.single("file")(req as any, {} as any, async (err: any) => {
      if (err) {
        return res.status(500).json({ message: "Erro no upload do arquivo" });
      }

      const file = (req as any).file;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME ?? "",
        Key: `fotosProdutos/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        const data = await s3.upload(params).promise();
        res.status(200).json({ message: "Arquivo enviado com sucesso", path: file.originalname });
      } catch (uploadError) {
        console.log(uploadError);
        res.status(500).json({ message: "Erro ao enviar para o Backblaze" });
      }
    });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
