import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MovieReview } from "../target/types/movie_review";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { findMetadataPda } from "@metaplex-foundation/js";
import { expect } from "chai";

describe("c5d3-movie-review", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MovieReview as Program<MovieReview>;

  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const nft = {
    uri: "",
    name: "Movie Reward Tokens",
    symbol: "RMT",
  };

  const [mintPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    program.programId
  );

  it("Initialize Token Mint", async () => {
    // Add your test here.
    //const tx = await program.methods.initialize().rpc();
    //cdcconsole.log("Your transaction signature", tx);

    const metadataPDA = await findMetadataPda(mintPDA);

    await program.methods
      .createRewardMint(nft.uri, nft.name, nft.symbol)
      .accounts({
        rewardMint: mintPDA,
        metadata: metadataPDA,
        user: provider.wallet.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .rpc();
  });
});
