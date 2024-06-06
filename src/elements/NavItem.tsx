import { Box, Link, Popover, PopoverContent, PopoverTrigger, Stack, useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import SubNav, { ISubNav } from './SubNav';

const NavItem: FC<ISubNav> = ({ label, children, href, href_blank, onToggle }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.400');
  const linkActiveColor = useColorModeValue('gray.800', 'white');
  const router = useRouter();
  const isCurrentPath = router.asPath === href || (href !== '/' && router.pathname.startsWith(href || '') && !href_blank);

  return (
    <Popover trigger={'hover'} placement={'bottom-start'}>
      <PopoverTrigger>
        <Box>
          <Box fontSize={17} fontWeight={500} color={isCurrentPath ? linkActiveColor : linkColor} _hover={{ textDecoration: 'none', color: linkActiveColor }} cursor="pointer">
            {children ? (
              <>
                {label} <ChevronDownIcon m="-1"/>
              </>
            ) : href_blank ? (
                <Link target="_blank" href={href_blank} _hover={{textDecoration: 'none'}}>
                  {label}
                </Link>
            ) :
            (
              <NextLink href={href || '/'} onClick={onToggle}>
                <Link _hover={{textDecoration: 'none'}}>
                  {label}
                </Link>
              </NextLink>
            )}
          </Box>
        </Box>
      </PopoverTrigger>

      {children && (
        <PopoverContent border={0} boxShadow={'xl'} p={4} rounded={'xl'} minW={'sm'}>
          <Stack>
            {children.map((child) => (
              <SubNav key={child.label} {...child} onToggle={onToggle}/>
            ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default NavItem;
