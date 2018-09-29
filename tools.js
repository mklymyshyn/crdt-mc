import {SHA256} from "crypto-js";
import {Transaction, Block, Blockchain} from "./struct.js";

export function hash(data ): string {
  return SHA256(data.map(s => s.toString()).join("/")).toString()
}

export function transactionHash(t) {
  if (!t) return "";
  return hash([t.timestamp, t.author, t.message])
}

export function merkleTreeHashes(txs : Array<Transaction>) : string {
  let hashes : Array<string> = [];

  // calc level1 merkle tree
  for (var i = 0; i < txs.length; i += 2) {
    let left = transactionHash(txs[i]), right = transactionHash(txs[i + 1]);
    hashes.push(hash([left, right]));
  }
  return hashes;
}

export function blockHash(block : Block) : string {
  return hash([block.prevHash, merkleTreeHashes(block.txs).join("")])
}

export function addBlock(bc : Blockchain, block : Block) : Block {
  block.hash = blockHash(block)
  bc.chain.push(block);
  return bc;
}
