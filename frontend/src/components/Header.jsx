import { Flex, Image, useColorMode } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { AiFillHome } from 'react-icons/ai'
import { RxAvatar } from 'react-icons/rx'
import {Link as RouterLink} from 'react-router-dom'
function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useRecoilValue(userAtom)
    return (
        <Flex justifyContent={"space-between"} mt={6} mb={12}>
{user && (
    <RouterLink to={'/'}>
    <AiFillHome size={24} />
    </RouterLink>
)}

            <Image
                cursor={"pointer"}
                alt='logo'
                w={6}
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"} 
                onClick={toggleColorMode}/>

{user && (
    <RouterLink to={`/${user.username}`}>
    <RxAvatar size={24} />
    </RouterLink>
)}
        </Flex>
    )
}

export default Header