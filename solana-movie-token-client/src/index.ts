import { initializeKeypair } from "./initializeKeypair";
import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";

const PROGRAM_ID = new web3.PublicKey(
  "Anw6dqUZzByPsNsKh4DXLrsSyrB4fh8xUhWdUdJqzy4a"
);

async function initializeProgramTokenMint(
  connection: web3.Connection,
  signer: web3.Keypair,
  programId: web3.PublicKey
): Promise<string> {
  const [tokenMint] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("token_mint")],
    PROGRAM_ID
  );
  const [tokenAuth] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("token_auth")],
    PROGRAM_ID
  );

  splToken.createInitializeMintInstruction;
  const tx = new web3.Transaction();
  const ix = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: tokenMint,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: tokenAuth,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: splToken.TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: web3.SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: PROGRAM_ID,
    // data: Buffer.from([3]),
    //data: Buffer.alloc(8),
  });

  tx.add(ix);
  return await web3.sendAndConfirmTransaction(connection, tx, [signer]);
}

async function main() {
  // const connection = new web3.Connection("http://localhost:8899"); //web3.clusterApiUrl("devnet"))
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const signer = await initializeKeypair(connection);

  const txid = await initializeProgramTokenMint(connection, signer, PROGRAM_ID);
  console.log(
    `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
  );
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
