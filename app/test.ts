require("dotenv").config({ path: ".env.local" });
const { academy_build_enroll_tx } = require("./src/lib/services/academy-client");

async function run() {
  try {
    const tx = await academy_build_enroll_tx({
      learner_public_key: "11111111111111111111111111111111", // dummy valid address
      course_id: "intro-to-tech"
    });
    console.log("Success:", tx);
  } catch (err) {
    console.error("Caught error:", err);
  }
}

run();
