import ESCROW_ABI from './ESCROW_ABI.json'
import axios from 'axios';
import { EscrowModel } from './EscrowModel'
import { GiConsoleController } from 'react-icons/gi';

const decodeEscrowData = (encoded: string) => {
  const cleanData = encoded.substring(2);
  const offset = parseInt(cleanData.substring(128, 192), 16)*2;
  const length = parseInt(cleanData.substring(offset+1, offset+64), 16);
  return {
        escrowCounter: parseInt(cleanData.substring(0, 64), 16),
        amount: (parseInt(cleanData.substring(64, 128), 16)) / 10**18,
        data: Buffer.from(cleanData.substring(offset+64, offset+64 + length*2), 'hex').toString()
  }
}

const decodeCertifyData = (encoded: string) => {
    const cleanData = encoded.substring(2);
    return {
        data: String(parseInt(cleanData.substring(64, 128), 16) !== 0),
        escrowCounter: parseInt(cleanData.substring(0, 64), 16)
    }
  }

export const getEscrowTxs = async (address: string, contract?: any): Promise<EscrowModel[]> => {
  return [];
}