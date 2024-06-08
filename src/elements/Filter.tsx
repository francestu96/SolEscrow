import { Button, Collapse, HStack, Input, InputGroup, InputLeftElement, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { AiOutlineClear } from "react-icons/ai";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { EscrowModel } from "utils/EscrowModel"

const Filter = ({ received, sent, setFilteredReceived, setFilteredSent, approved=undefined, setFilteredApproved=undefined, disabled=false }: { received: EscrowModel | null | undefined, sent: EscrowModel | null | undefined, setFilteredReceived: Dispatch<SetStateAction<EscrowModel | null | undefined>>, setFilteredSent: Dispatch<SetStateAction<EscrowModel | null | undefined>>, approved?: EscrowModel | null | undefined, setFilteredApproved?: Dispatch<SetStateAction<EscrowModel | null | undefined>> | undefined, disabled?: boolean }) => {
  const [show, setShow] = useState(false);
  const bgColor = "main";
  const hoverBgColor = "rebeccapurple";

  const [inputText, setInputText] = useState<string>("");
  const [inputDateFrom, setInputDateFrom] = useState<string>("");
  const [inputDateTo, setInputDateTo] = useState<string>("");
  const [inputFromAddress, setInputFromAddress] = useState<string>("");
  const [inputToAddress, setInputToAddress] = useState<string>("");

  const filter = () => {
    let filteredSent: EscrowModel = {
      amount: [],
      approverPercFees: Buffer.alloc(0),
      message: [],
      status: Buffer.alloc(0),
      timestamp: [],
      approver: [],
      receiver: [],
      sender: []
    }

    for (let i = 0; i < (sent?.amount.length || 0); i++){
      if ((inputText ? sent?.message[i].toLowerCase().includes(inputText.toLowerCase()) : true) &&
        (inputDateFrom ? new Date(inputDateFrom).getTime() <= new Date(sent!.timestamp[i].toNumber() * 1000).getTime() : true) &&
        (inputDateTo ? new Date(inputDateTo).getTime() >= new Date(sent!.timestamp[i].toNumber() * 1000).getTime() : true) &&
        (inputFromAddress ? sent?.sender?.toString()[i].toLowerCase() == inputFromAddress?.toLowerCase() : true) &&
        (inputToAddress ? sent?.receiver?.toString()[i].toLowerCase() == inputToAddress?.toLowerCase() : true)){
          filteredSent.amount.push(approved!.amount[i]);
          filteredSent.approver?.push(approved!.approver![i]);
          filteredSent.sender?.push(approved!.sender![i]);
          filteredSent.receiver?.push(approved!.receiver![i]);
          filteredSent.message.push(approved!.message[i]);
          filteredSent.timestamp.push(approved!.timestamp[i]);
          filteredSent.status = Buffer.concat([filteredSent.status], approved!.status[i]);
        }
    }

    let filteredReceived: EscrowModel = {
      amount: [],
      approverPercFees: Buffer.alloc(0),
      message: [],
      status: Buffer.alloc(0),
      timestamp: [],
      approver: [],
      receiver: [],
      sender: []
    }

    for (let i = 0; i < (received?.amount.length || 0); i++){
      if ((inputText ? received?.message[i].toLowerCase().includes(inputText.toLowerCase()) : true) &&
        (inputDateFrom ? new Date(inputDateFrom).getTime() <= new Date(received!.timestamp[i].toNumber() * 1000).getTime() : true) &&
        (inputDateTo ? new Date(inputDateTo).getTime() >= new Date(received!.timestamp[i].toNumber() * 1000).getTime() : true) &&
        (inputFromAddress ? received?.sender?.toString()[i].toLowerCase() == inputFromAddress?.toLowerCase() : true) &&
        (inputToAddress ? received?.receiver?.toString()[i].toLowerCase() == inputToAddress?.toLowerCase() : true)){
          filteredReceived.amount.push(approved!.amount[i]);
          filteredReceived.approver?.push(approved!.approver![i]);
          filteredReceived.sender?.push(approved!.sender![i]);
          filteredReceived.receiver?.push(approved!.receiver![i]);
          filteredReceived.message.push(approved!.message[i]);
          filteredReceived.timestamp.push(approved!.timestamp[i]);
          filteredReceived.status = Buffer.concat([filteredReceived.status], approved!.status[i]);
        }
    }

    let filteredCertified: EscrowModel = {
      amount: [],
      approverPercFees: Buffer.alloc(0),
      message: [],
      status: Buffer.alloc(0),
      timestamp: [],
      approver: [],
      receiver: [],
      sender: []
    }

    for (let i = 0; i < (approved?.amount.length || 0); i++){
      if ((inputText ? approved?.message[i].toLowerCase().includes(inputText.toLowerCase()) : true) &&
        (inputDateFrom ? new Date(inputDateFrom).getTime() <= new Date(approved!.timestamp[i].toNumber() * 1000).getTime() : true) &&
        (inputDateTo ? new Date(inputDateTo).getTime() >= new Date(approved!.timestamp[i].toNumber() * 1000).getTime() : true) &&
        (inputFromAddress ? approved?.sender?.toString()[i].toLowerCase() == inputFromAddress?.toLowerCase() : true) &&
        (inputToAddress ? approved?.receiver?.toString()[i].toLowerCase() == inputToAddress?.toLowerCase() : true)){
          filteredCertified.amount.push(approved!.amount[i]);
          filteredCertified.approver?.push(approved!.approver![i]);
          filteredCertified.sender?.push(approved!.sender![i]);
          filteredCertified.receiver?.push(approved!.receiver![i]);
          filteredCertified.message.push(approved!.message[i]);
          filteredCertified.timestamp.push(approved!.timestamp[i]);
          filteredCertified.status = Buffer.concat([filteredCertified.status], approved!.status[i]);
        }
    }

    setFilteredSent(filteredSent);
    setFilteredReceived(filteredReceived);
    setFilteredApproved && setFilteredApproved(filteredCertified);
  }

  const clear = () => {
    setInputText("");
    setInputDateFrom("");
    setInputDateTo("");
    setInputFromAddress("");
    setInputToAddress("");

    setFilteredReceived(received);
    setFilteredSent(sent);
    setFilteredApproved && setFilteredApproved(approved);
  }

  return (
    <>
      <Tooltip label="Cooming soon!" hasArrow isDisabled={!disabled}>
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
          <Tooltip label="Cooming soon!" hasArrow>
            <Button rightIcon={<FiFilter />} colorScheme="whatsapp" w="18.5%" fontSize={["xs", "sm", "md", "md"]} cursor="not-allowed">
              Filter
            </Button>
          </Tooltip>
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
      </Collapse>
    </>
  )
}

export default Filter;

