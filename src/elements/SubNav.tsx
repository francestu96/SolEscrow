import { Icon, ChevronRightIcon } from '@chakra-ui/icons';
import { useColorModeValue, Stack, Flex, Box, Text, Link, Image } from '@chakra-ui/react';

export interface ISubNav {
  label: string;
  href?: string;
  href_blank?: string;
  subLabel?: string;
  logo?: string;
  children?: Array<ISubNav>;
  onToggle?: any;
}

const SubNav = ({ label, href, href_blank, subLabel, logo, onToggle }: ISubNav) => {
  return (
    <Link
      onClick={onToggle}
      target={href_blank ? "_blank" : ""}
      href={href || href_blank || '#'}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('gray.200', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'} gap="5">
        <Image src={logo} width={46} height={46} id={`${label}-navitem`} alt="item logo"/>
        <Box>
          <Text transition={'all .3s ease'} _groupHover={{ color: "main" }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color="main" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

export default SubNav;
