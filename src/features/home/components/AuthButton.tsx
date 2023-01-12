import {
  Avatar,
  Button,
  Card,
  CardBody,
  ChakraComponent,
  HStack,
  useDisclosure,
  Text,
  Spacer,
  Stack,
  Heading,
  Tooltip,
} from "@chakra-ui/react"
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react"
import LoginModal from "../../../components/modal/LoginModal"
import { useUserStore } from "../../../libs/UserStore"

type DivComponent = ChakraComponent<"div", object>

const AuthButton = (() => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { uid, userName, avatarImageUrl } = useUserStore()
  const supabase = useSupabaseClient()
  const session = useSession()

  return (
    <>
      {!session ? (
        <>
          <Button onClick={onOpen} width={"100%"} size={"lg"}>
            ログイン
          </Button>
          <LoginModal isOpen={isOpen} onClose={onClose} />
        </>
      ) : (
        <>
          <Card
            width={"100%"}
            borderRadius={"16"}
            shadow={"none"}
            background={"gray.100"}
          >
            <CardBody>
              <HStack spacing={4}>
                <Avatar
                  src={avatarImageUrl ?? undefined}
                  name={userName ?? undefined}
                />
                <Stack spacing={1}>
                  <Tooltip
                    label={uid ?? "undefined"}
                    fontSize={"xs"}
                    hasArrow
                    arrowSize={10}
                    placement={"top"}
                  >
                    <Heading size={"md"}>{userName}</Heading>
                  </Tooltip>
                  <Text fontSize={"xs"}>ログイン済み</Text>
                </Stack>
                <Spacer />
                <Button
                  variant={"outline"}
                  onClick={() => supabase.auth.signOut()}
                  background={"whiteAlpha.600"}
                >
                  ログアウト
                </Button>
              </HStack>
            </CardBody>
          </Card>
        </>
      )}
    </>
  )
}) as DivComponent

export default AuthButton
