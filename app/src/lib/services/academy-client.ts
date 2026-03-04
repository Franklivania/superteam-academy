import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";

type Academy_enroll_params = {
  learner_public_key: string;
  course_id: string;
};

type Academy_complete_lesson_params = {
  learner_public_key: string;
  course_id: string;
  lesson_index: number;
  xp_mint: string;
};

type Academy_finalize_course_params = {
  learner_public_key: string;
  course_id: string;
  xp_mint: string;
};

type Academy_reward_xp_params = {
  recipient_public_key: string;
  amount: number;
  reason: string;
};

type Academy_issue_credential_params = {
  learner_public_key: string;
  course_id: string;
  credential_name: string;
  metadata_uri: string;
  courses_completed: number;
  total_xp: number;
};

type Academy_upgrade_credential_params = {
  learner_public_key: string;
  course_id: string;
  credential_asset: string;
  new_name: string;
  new_metadata_uri: string;
  courses_completed: number;
  total_xp: number;
};

type Academy_award_achievement_params = {
  recipient_public_key: string;
  achievement_id: string;
};

const PROGRAM_ID_ENV = process.env.NEXT_PUBLIC_PROGRAM_ID;
const XP_MINT_ENV = process.env.NEXT_PUBLIC_XP_MINT;
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC;

if (!PROGRAM_ID_ENV) {
  throw new Error("NEXT_PUBLIC_PROGRAM_ID is not configured");
}

if (!XP_MINT_ENV) {
  throw new Error("NEXT_PUBLIC_XP_MINT is not configured");
}

const PROGRAM_ID = new PublicKey(PROGRAM_ID_ENV);
const XP_MINT = new PublicKey(XP_MINT_ENV);

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
const onchain_academy_idl = require("../idl/onchain_academy.json") as anchor.Idl;

export class NodeWallet {
  constructor(readonly payer: anchor.web3.Keypair) { }
  async signTransaction<T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction>(tx: T): Promise<T> {
    if ("version" in tx) {
      tx.sign([this.payer]);
    } else {
      tx.partialSign(this.payer);
    }
    return tx;
  }
  async signAllTransactions<T extends anchor.web3.Transaction | anchor.web3.VersionedTransaction>(txs: T[]): Promise<T[]> {
    return txs.map((t) => {
      if ("version" in t) {
        t.sign([this.payer]);
      } else {
        t.partialSign(this.payer);
      }
      return t;
    });
  }
  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}
function get_anchor_provider(): anchor.AnchorProvider {
  const connection = new anchor.web3.Connection(SOLANA_RPC_URL ?? anchor.web3.clusterApiUrl("devnet"), {
    commitment: "confirmed",
  });

  const backend_signer_raw = process.env.BACKEND_SIGNER_PRIVATE_KEY;
  if (!backend_signer_raw) {
    throw new Error("BACKEND_SIGNER_PRIVATE_KEY is not configured");
  }

  let backend_signer: anchor.web3.Keypair;
  try {
    const secret_key = JSON.parse(backend_signer_raw) as number[];
    const secret_bytes = Uint8Array.from(secret_key);
    backend_signer = anchor.web3.Keypair.fromSecretKey(secret_bytes);
  } catch {
    throw new Error("Invalid BACKEND_SIGNER_PRIVATE_KEY");
  }

  const wallet = new NodeWallet(backend_signer);

  return new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });
}

function get_program(): anchor.Program {
  const provider = get_anchor_provider();
  // anchor.Program constructor types are not available in this environment,
  // so we cast through a generic constructor to satisfy TypeScript.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ProgramCtor = anchor.Program as any as {
    new(idl: anchor.Idl, program_id: PublicKey, provider: anchor.AnchorProvider): anchor.Program;
  };
  return new ProgramCtor(onchain_academy_idl, PROGRAM_ID, provider);
}

function derive_config_pda(): PublicKey {
  const [config_pda] = PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID);
  return config_pda;
}

function derive_course_pda(course_id: string): PublicKey {
  const [course_pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("course"), Buffer.from(course_id, "utf8")],
    PROGRAM_ID,
  );
  return course_pda;
}

function derive_enrollment_pda(course_id: string, learner_public_key: PublicKey): PublicKey {
  const [enrollment_pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("enrollment"), Buffer.from(course_id, "utf8"), learner_public_key.toBuffer()],
    PROGRAM_ID,
  );
  return enrollment_pda;
}

function derive_minter_role_pda(minter_public_key: PublicKey): PublicKey {
  const [minter_role_pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("minter"), minter_public_key.toBuffer()],
    PROGRAM_ID,
  );
  return minter_role_pda;
}

function derive_achievement_type_pda(achievement_id: string): PublicKey {
  const [achievement_type_pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("achievement"), Buffer.from(achievement_id, "utf8")],
    PROGRAM_ID,
  );
  return achievement_type_pda;
}

function derive_achievement_receipt_pda(achievement_id: string, recipient_public_key: PublicKey): PublicKey {
  const [receipt_pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("achievement_receipt"), Buffer.from(achievement_id, "utf8"), recipient_public_key.toBuffer()],
    PROGRAM_ID,
  );
  return receipt_pda;
}

export async function academy_enroll(params: Academy_enroll_params): Promise<string> {
  const program = get_program();
  const learner_public_key = new PublicKey(params.learner_public_key);
  const course_pda = derive_course_pda(params.course_id);
  const enrollment_pda = derive_enrollment_pda(params.course_id, learner_public_key);

  const tx_signature = await program.methods
    .enroll(params.course_id)
    .accountsPartial({
      course: course_pda,
      enrollment: enrollment_pda,
      learner: learner_public_key,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx_signature;
}

/**
 * Build an unsigned enroll transaction for the learner's wallet to sign and send.
 * Returns a base64-encoded serialized transaction.
 */
export async function academy_build_enroll_tx(params: Academy_enroll_params): Promise<string> {
  const program = get_program();
  const provider = program.provider as anchor.AnchorProvider;
  const learner_public_key = new PublicKey(params.learner_public_key);
  const course_pda = derive_course_pda(params.course_id);
  const enrollment_pda = derive_enrollment_pda(params.course_id, learner_public_key);

  const ix = await program.methods
    .enroll(params.course_id)
    .accountsPartial({
      course: course_pda,
      enrollment: enrollment_pda,
      learner: learner_public_key,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const { blockhash } = await provider.connection.getLatestBlockhash("confirmed");
  const tx = new anchor.web3.Transaction({
    recentBlockhash: blockhash,
    feePayer: learner_public_key,
  }).add(ix);

  const serialized = tx.serialize({ requireAllSignatures: false });
  return Buffer.from(serialized).toString("base64");
}

export async function academy_complete_lesson(params: Academy_complete_lesson_params): Promise<string> {
  const program = get_program();
  const wallet = program.provider.wallet as NodeWallet;
  const learner_public_key = new PublicKey(params.learner_public_key);
  const config_pda = derive_config_pda();
  const course_pda = derive_course_pda(params.course_id);
  const enrollment_pda = derive_enrollment_pda(params.course_id, learner_public_key);
  const xp_mint = new PublicKey(params.xp_mint);

  const learner_xp_ata = getAssociatedTokenAddressSync(xp_mint, learner_public_key, false, TOKEN_2022_PROGRAM_ID);

  const tx_signature = await program.methods
    .completeLesson(params.lesson_index)
    .accountsPartial({
      config: config_pda,
      course: course_pda,
      enrollment: enrollment_pda,
      learner: learner_public_key,
      learnerTokenAccount: learner_xp_ata,
      xpMint: xp_mint,
      backendSigner: wallet.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();

  return tx_signature;
}

export async function academy_finalize_course(params: Academy_finalize_course_params): Promise<string> {
  const program = get_program();
  const wallet = program.provider.wallet as NodeWallet;
  const learner_public_key = new PublicKey(params.learner_public_key);
  const config_pda = derive_config_pda();
  const course_pda = derive_course_pda(params.course_id);
  const enrollment_pda = derive_enrollment_pda(params.course_id, learner_public_key);
  const xp_mint = new PublicKey(params.xp_mint);

  const learner_xp_ata = getAssociatedTokenAddressSync(xp_mint, learner_public_key, false, TOKEN_2022_PROGRAM_ID);

  const tx_signature = await program.methods
    .finalizeCourse()
    .accountsPartial({
      config: config_pda,
      course: course_pda,
      enrollment: enrollment_pda,
      learner: learner_public_key,
      learnerTokenAccount: learner_xp_ata,
      xpMint: xp_mint,
      backendSigner: wallet.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();

  return tx_signature;
}

export async function academy_reward_xp(params: Academy_reward_xp_params): Promise<string> {
  const program = get_program();
  const wallet = program.provider.wallet as NodeWallet;
  const recipient_public_key = new PublicKey(params.recipient_public_key);
  const config_pda = derive_config_pda();
  const minter_role_pda = derive_minter_role_pda(wallet.publicKey);

  const recipient_xp_ata = getAssociatedTokenAddressSync(XP_MINT, recipient_public_key, false, TOKEN_2022_PROGRAM_ID);

  const bn_amount = new anchor.BN(params.amount);

  const tx_signature = await program.methods
    .rewardXp(bn_amount, params.reason)
    .accountsPartial({
      config: config_pda,
      minterRole: minter_role_pda,
      xpMint: XP_MINT,
      recipientTokenAccount: recipient_xp_ata,
      minter: wallet.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();

  return tx_signature;
}

export async function academy_issue_credential(params: Academy_issue_credential_params): Promise<string> {
  const program = get_program();
  const wallet = program.provider.wallet as NodeWallet;
  const learner_public_key = new PublicKey(params.learner_public_key);
  const config_pda = derive_config_pda();
  const course_pda = derive_course_pda(params.course_id);
  const enrollment_pda = derive_enrollment_pda(params.course_id, learner_public_key);

  const credential_asset = anchor.web3.Keypair.generate();

  const courses_completed_bn = new anchor.BN(params.courses_completed);
  const total_xp_bn = new anchor.BN(params.total_xp);

  const tx_signature = await program.methods
    .issueCredential(params.credential_name, params.metadata_uri, courses_completed_bn, total_xp_bn)
    .accountsPartial({
      config: config_pda,
      course: course_pda,
      enrollment: enrollment_pda,
      learner: learner_public_key,
      credentialAsset: credential_asset.publicKey,
      payer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([credential_asset])
    .rpc();

  return tx_signature;
}

export async function academy_upgrade_credential(params: Academy_upgrade_credential_params): Promise<string> {
  const program = get_program();
  const wallet = program.provider.wallet as NodeWallet;
  const learner_public_key = new PublicKey(params.learner_public_key);
  const config_pda = derive_config_pda();
  const course_pda = derive_course_pda(params.course_id);
  const enrollment_pda = derive_enrollment_pda(params.course_id, learner_public_key);

  const credential_asset = new PublicKey(params.credential_asset);

  const courses_completed_bn = new anchor.BN(params.courses_completed);
  const total_xp_bn = new anchor.BN(params.total_xp);

  const tx_signature = await program.methods
    .upgradeCredential(params.new_name, params.new_metadata_uri, courses_completed_bn, total_xp_bn)
    .accountsPartial({
      config: config_pda,
      course: course_pda,
      enrollment: enrollment_pda,
      learner: learner_public_key,
      credentialAsset: credential_asset,
      payer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx_signature;
}

export async function academy_award_achievement(params: Academy_award_achievement_params): Promise<string> {
  const program = get_program();
  const wallet = program.provider.wallet as NodeWallet;
  const recipient_public_key = new PublicKey(params.recipient_public_key);
  const config_pda = derive_config_pda();
  const achievement_type_pda = derive_achievement_type_pda(params.achievement_id);
  const receipt_pda = derive_achievement_receipt_pda(params.achievement_id, recipient_public_key);
  const minter_role_pda = derive_minter_role_pda(wallet.publicKey);

  const recipient_xp_ata = getAssociatedTokenAddressSync(XP_MINT, recipient_public_key, false, TOKEN_2022_PROGRAM_ID);

  const tx = await program.methods
    .awardAchievement()
    .accountsPartial({
      config: config_pda,
      achievementType: achievement_type_pda,
      achievementReceipt: receipt_pda,
      minterRole: minter_role_pda,
      recipient: recipient_public_key,
      recipientTokenAccount: recipient_xp_ata,
      xpMint: XP_MINT,
      payer: wallet.publicKey,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

