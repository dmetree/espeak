import {
  Lucid,
  Blockfrost,
  validatorToAddress,
  Data,
  fromText,
} from "@lucid-evolution/lucid";

const REQUEST_SCRIPT_COMPILED_CODE = 
"5908d701000032323232323232232232323232322322533300c3232323232325333012300d301337540022646464a66602a6022602c6ea80304cc004c01cc05cdd50051803980b9baa01213232323232533301a3016301b37540022646464a66603a6032603c6ea80044c94ccc078cdd7806180818101baa0041533301e3300a301030203754026602460406ea806c4c8c94ccc080cc88c94ccc08cc078c090dd5000899b88375a6050604a6ea800400858c050c090dd5180b18121baa002300130223754602460446ea8054dd6980118111baa01d1323232323232323253330283370e900218149baa001132323232533302c3375e603a66060603c605c6ea80a4cc0c0c080c0b8dd501499818180898171baa02933030300e302e37540526606060626064606460646064605c6ea80a4cc0c0c0c4c0c8c0c8c0c8c0c8c0c8c0b8dd501499818180618171baa02933030300d302e3754052660606032605c6ea80a4cc0c0c02cc0b8dd501499818180518171baa029330303009302e375405297ae00041533302c3301400f02a1533302c002100114a0294052819b893005323300100137586040605c6ea803c894ccc0c000452f5c0264666444646600200200644a66606c0022006264660706e9ccc0e0dd48031981c181c8009981c181c981d000a5eb80cc00c00cc0e8008dd6181c0009bae30330013758606660680026600600660680046eb0c0c8005200a533302a533302a3371e6eb8c028c0b0dd50139bae3009302c375404e266e3cdd7180598161baa027375c601060586ea809c528099b873330063758603c60586ea8034dd7180518161baa027375c601660586ea809ccdc01bad3017302c375404e6eb4c01cc0b0dd50138a99981519b873330063758603c60586ea8034dd7180518161baa027375c601660586ea809cdd6980b98161baa02713370e66600c6eb0c078c0b0dd50069bae3009302c375404e6eb8c020c0b0dd50139bad3007302c375404e29414ccc0a4c094c0a8dd5000899191919191919191919191919191919191919191919191929998221823801099191924c607802a607602c607402e2c6eb4c114004c114008dd7182180098218011bae30410013041002375a607e002607e0046eb8c0f4004c0f4008dd7181d800981d8011bad30390013039002375a606e002606e0046eb4c0d4004c0d4008c0cc004c0cc008c0c4004c0c4008c0bc004c0acdd50008b181698151baa00116300c30293754014600200244a66605400229000099b8048008cc008008c0b4004888c94ccc0a0c08cc0a4dd50008a400026eb4c0b4c0a8dd5000992999814181198149baa00114c103d87a8000132330010013758605c60566ea8008894ccc0b4004530103d87a80001323232533302d3371e00e6eb8c0c800c4c078cc0c4dd4000a5eb804cc014014008dd69818981900118188011bac302f001323300100100422533302c00114c103d87a80001323232533302c3371e00e6eb8c0c400c4c074cc0c0dd3800a5eb804cc014014008dd61818181880118180011bac302e00123029302a302a302a302a302a302a302a302a302a302a302a001230283029302930293029302930293029302930293029001230273028302830283028302830283028302830280012302630273027302730273027302700114a04604a604c604c604c604c604c604c604c00246048604a604a604a00229405281811180f9baa001163300537586002603c6ea8c038c078dd50088039181098111811000980f980e1baa00116330023300c3758601660366ea8c02cc06cdd50071198011807180e1baa00100a0042232533301b3016301c3754002266e3cdd71810180e9baa00100214a0601860386ea8c030c070dd50011800800911299980e0010a6103d87a800013232533301b30170031300c3301f0024bd70099980280280099b8000348004c08000cc078008dd6980d180b9baa00c2232533301730133018375400226644646600200200644a66603c00229404c94ccc070cdc79bae302100200414a226600600600260420026eb0c010c064dd50019bae301c301937540022c601060306ea80048c064c068c068c068c068c068c068c068c068004c05cc050dd50008a5030053013375400c6644a666024601a60266ea80084c8c94ccc050c040c054dd5000899299980a9808180b1baa0011375c6034602e6ea800458c018c058dd51803180b1baa3008301637546032602c6ea800458c94ccc05c004530103d87a8000130053301830190014bd7019803001119baf300630163754002004602e60286ea800858c010c048dd50029bac300230123754600460246ea8014dd2a40004602800244646600200200644a666028002297ae01323253330133005002133017002330040040011330040040013018002301600123012301300114984d958c94ccc02cc01c00454ccc038c034dd50010a4c2c2a666016600c00226464a66602060260042930b1bad3011001300d37540042c60166ea80054ccc020c010c024dd5002899191919191919191919191919191919191919191919191929998119813001099191924c603602a603402c603202e2c6eb4c090004c090008dd7181100098110011bae30200013020002375a603c002603c0046eb8c070004c070008dd7180d000980d0011bad30180013018002375a602c002602c0046eb4c050004c050008c048004c048008c040004c040008c038004c028dd50028b12999804180218049baa001132323232533300f301200213232498c94ccc038c0280044c8c94ccc04cc0580084c926325333011300d0011323253330163019002132498c03400458c05c004c04cdd50010a99980898060008991919191919299980d180e8010a4c2c6eb4c06c004c06c008dd6980c800980c8011bad3017001301337540042c60226ea800458c050004c040dd50018a99980718048008a99980898081baa00314985858c038dd500118030018b18080009808001180700098051baa001162325333008300400113232533300d3010002149858dd7180700098051baa00215333008300300113232533300d3010002149858dd7180700098051baa00216300837540026e1d2002370e90001bae0015734aae7555cf2ab9f5740ae855d11";

const getUserLucid = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
  const apiUrl = process.env.NEXT_PUBLIC_BLOCKFROST_URL || "";
  const lucid = await Lucid(
    new Blockfrost(apiUrl, apiKey),
    process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK
  );
  const utxos = await lucid.utxosAt(address);
  lucid.selectWallet.fromAddress(address, utxos);
  return lucid;
};

function buildTransactionDatum(data) {
  try {
    const preparedData = {
        student: fromText(data.clientUid),
        teacher: fromText(data.specUid),
        admin: fromText(''),
        lessonStartTime: BigInt(data.scheduledUnixtime),
        lessonDuration: BigInt(60),
        deltaAfterLesson: BigInt(50),
        lessonLockTokenPolicyId: fromText(''),
        lessonLockTokenAssetName: fromText(''),
        lessonLockAmount: BigInt(data.price * 1_000_000),
        lessonPriceTokenPolicyId: fromText(''),
        lessonPriceTokenAssetName: fromText(''),
        lessonPriceAmount: BigInt(data.price * 1_000_000),
    };
    return Data.to(
      preparedData,
      Data.Object({
        student: Data.Bytes(),
        teacher: Data.Bytes(),
        admin: Data.Bytes(),
        lessonStartTime: Data.Integer(),
        lessonDuration: Data.Integer(),
        deltaAfterLesson: Data.Integer(),
        lessonLockTokenPolicyId: Data.Bytes(),
        lessonLockTokenAssetName: Data.Bytes(),
        lessonLockAmount: Data.Integer(),
        lessonPriceTokenPolicyId: Data.Bytes(),
        lessonPriceTokenAssetName: Data.Bytes(),
        lessonPriceAmount: Data.Integer(),
      })
    );
  } catch (error) {
    console.error("Error building datum:", error);
    return null;
  }
}

export default async function handler(req, res) {
  // Basic CORS headers so that http://localhost:3000 can call https://localhost:3000 in dev
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    console.log("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userAddress, lessonData } = req.body;
    console.log("Request body:", req.body);

    const script = {
      type: "PlutusV3",
      script: REQUEST_SCRIPT_COMPILED_CODE?.trim(),
    };
    if (!script.script) {
        throw new Error("Plutus script not configured");
    }
    console.log("Using script:", script);

    const validatorAddress = validatorToAddress(
      process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK,
      script
    );
    console.log("Validator address:", validatorAddress);

    const datum = buildTransactionDatum(lessonData);
    if (!datum) {
      throw new Error("Failed to build datum");
    }
    console.log("Built datum:", datum);

    const lucid = await getUserLucid(userAddress);
    let tx = await lucid
      .newTx()
      .pay.ToContract(
        validatorAddress,
        { kind: "inline", value: datum },
        { lovelace: BigInt(lessonData.price * 1000000) }
      )
      .addSigner(userAddress)
      .complete();

    return res.status(200).json({
      success: true,
      txCbor: tx.toCBOR(),
    });
  } catch (err) {
    console.error("API error in /api/lessons/request:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
}
