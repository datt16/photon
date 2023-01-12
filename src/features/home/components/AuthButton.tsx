import {
  Button,
  ChakraComponent,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  ModalFooter,
  theme,
} from "@chakra-ui/react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { ThemeSupa, Auth } from "@supabase/auth-ui-react"

type DivComponent = ChakraComponent<"div", object>

const AuthButton = (() => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const supabase = useSupabaseClient()
  return (
    <>
      <Button onClick={onOpen} width={"100%"} size={"lg"}>
        ログイン
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ログイン</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {},
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "メールアドレス",
                    email_input_placeholder: "メールアドレスを入力",
                    password_label: "パスワード",
                    password_input_placeholder: "パスワードを入力",
                    button_label: "ログイン",
                    link_text: "既にアカウントをお持ちですか？",
                  },
                  sign_up: {
                    email_label: "メールアドレス",
                    email_input_placeholder: "メールアドレスを入力",
                    password_label: "パスワード",
                    password_input_placeholder: "パスワードを入力",
                    button_label: "新規登録",
                    link_text: "アカウントが必要ですか？",
                  },
                  update_password: {
                    button_label: "パスワードを更新",
                    password_label: "パスワード",
                    password_input_placeholder: "新しいパスワードを入力",
                  },
                  forgotten_password: {
                    button_label: "メールを送信する",
                    email_input_placeholder: "登録していたメールアドレスを入力",
                    email_label: "登録済みのメールアドレス",
                    link_text: "パスワードをお忘れですか？",
                  },
                },
              }}
              providers={["google", "github"]}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}) as DivComponent

export default AuthButton
