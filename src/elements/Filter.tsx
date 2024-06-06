import { Button, Collapse, HStack, Input, InputGroup, InputLeftElement, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { AiOutlineClear } from "react-icons/ai";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { EscrowModel } from "src/utils/EscrowModel"

const Filter = ({ received, sent, setFilteredReceived, setFilteredSent, certify=undefined, setFilteredCertify=undefined, disabled=false }: { received: EscrowModel[], sent: EscrowModel[], setFilteredReceived: Dispatch<SetStateAction<EscrowModel[] | undefined>>, setFilteredSent: Dispatch<SetStateAction<EscrowModel[] | undefined>>, certify?: EscrowModel[] | undefined, setFilteredCertify?: Dispatch<SetStateAction<EscrowModel[] | undefined>> | undefined, disabled?: boolean }) => {
  const [show, setShow] = useState(false);
  const bgColor = "main";
  const hoverBgColor = "#cc0018";

  const [inputText, setInputText] = useState<string>("");
  const [inputDateFrom, setInputDateFrom] = useState<string>("");
  const [inputDateTo, setInputDateTo] = useState<string>("");
  const [inputFromAddress, setInputFromAddress] = useState<string>("");
  const [inputToAddress, setInputToAddress] = useState<string>("");

//   const filter = () => {
//     const filteredReceived = received.filter(x =>
//       (inputText ? x.data?.toLowerCase().includes(inputText.toLowerCase()) : true) &&
//       (inputDateFrom ? new Date(inputDateFrom).getTime() <= new Date(parseInt(x.timeStamp, 16) * 1000).getTime() : true) &&
//       (inputDateTo ? new Date(inputDateTo).getTime() >= new Date(parseInt(x.timeStamp, 16) * 1000).getTime() : true) &&
//       (inputFromAddress ? x.topics[1] == "0x" + inputFromAddress?.substring(2).padStart(64, '0').toLowerCase() : true) &&
//       (inputToAddress ? x.topics[2] == "0x" + inputToAddress?.substring(2).padStart(64, '0').toLowerCase() : true)
//     )

//     const sentReceived = sent.filter(x =>
//       (inputText ? x.data?.toLowerCase().includes(inputText.toLowerCase()) : true) &&
//       (inputDateFrom ? new Date(inputDateFrom).getTime() <= new Date(parseInt(x.timeStamp, 16) * 1000).getTime() : true) &&
//       (inputDateTo ? new Date(inputDateTo).getTime() >= new Date(parseInt(x.timeStamp, 16) * 1000).getTime() : true) &&
//       (inputFromAddress ? x.topics[1] == "0x" + inputFromAddress?.substring(2).padStart(64, '0').toLowerCase() : true) &&
//       (inputToAddress ? x.topics[2] == "0x" + inputToAddress?.substring(2).padStart(64, '0').toLowerCase() : true)
//     )

//     setFilteredReceived(filteredReceived);
//     setFilteredSent(sentReceived);

//     if(certify && setFilteredCertify){
//         const filteredCertify = sent.filter(x =>
//             (inputText ? x.data?.toLowerCase().includes(inputText.toLowerCase()) : true) &&
//             (inputDateFrom ? new Date(inputDateFrom).getTime() <= new Date(parseInt(x.timeStamp, 16) * 1000).getTime() : true) &&
//             (inputDateTo ? new Date(inputDateTo).getTime() >= new Date(parseInt(x.timeStamp, 16) * 1000).getTime() : true) &&
//             (inputFromAddress ? x.topics[1] == "0x" + inputFromAddress?.substring(2).padStart(64, '0').toLowerCase() : true) &&
//             (inputToAddress ? x.topics[2] == "0x" + inputToAddress?.substring(2).padStart(64, '0').toLowerCase() : true)
//         )
//         setFilteredCertify(filteredCertify);
//     }
//   }

//   const clear = () => {
//     setInputText("");
//     setInputDateFrom("");
//     setInputDateTo("");
//     setInputFromAddress("");
//     setInputToAddress("");

//     setFilteredReceived(received);
//     setFilteredSent(sent);
//   }

  return (
    <>
      {/* <Tooltip label="Cooming soon!" hasArrow isDisabled={!disabled}>
        <Button isDisabled={disabled} onClick={() => setShow(!show)} color={show ? "gray.800" : "white"} backgroundColor={show ? "gray.200" : bgColor} _hover={show ? { bg: "gray.300" } : { bg: hoverBgColor }} rightIcon={show ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />} w="full" height="2rem">{show ? "Collapse Filter" : "Expand Filter"}</Button>
      </Tooltip>
      <Collapse in={show} style={{ width: "inherit" }} animateOpacity>
        <HStack justify="space-between">
          <InputGroup width="50%">
            <InputLeftElement pointerEvents='none'>
              <FiFilter />
            </InputLeftElement>
            <Input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Filter for message text" />
          </InputGroup>
          <Input value={inputDateFrom?.toString()} onChange={(e) => setInputDateFrom(e.target.value)} placeholder="From" w="15%" type="date" />
          <Input value={inputDateTo?.toString()} onChange={(e) => setInputDateTo(e.target.value)} placeholder="To" w="15%" type="date" />
          <Button rightIcon={<FiFilter />} colorScheme="whatsapp" w="18.5%" fontSize={["xs", "sm", "md", "md"]} onClick={filter}>
            Filter
          </Button>
        </HStack>
        <HStack justify="space-between" mt="2">
          <InputGroup width="40%">
            <InputLeftElement pointerEvents='none'>
              <BsFillPersonFill />
            </InputLeftElement>
            <Input value={inputFromAddress} onChange={(e) => setInputFromAddress(e.target.value)} placeholder="From address" />
          </InputGroup>
          <InputGroup width="40%">
            <InputLeftElement pointerEvents='none'>
              <BsFillPersonFill />
            </InputLeftElement>
            <Input value={inputToAddress} onChange={(e) => setInputToAddress(e.target.value)} placeholder="To address" />
          </InputGroup>
          <Button rightIcon={<AiOutlineClear />} colorScheme="red" w="18.5%" fontSize={["xs", "sm", "md", "md"]} onClick={clear}>
            Clear
          </Button>
        </HStack>
      </Collapse> */}
    </>
  )
}

export default Filter;

