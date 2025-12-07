import {
  Lucid,
  Blockfrost,
  validatorToAddress,
  Data,
  fromText,
} from "@lucid-evolution/lucid";

const REQUEST_ACCEPTED_SCRIPT_COMPILED_CODE = 
"5913360100003232323232323223223232323232232322533300d3232323232325333013300e30143754002264646464646464646464646464646464646464646464a64666054604c02c2646464a66605a6052605c6ea80044c8c94ccc0bcc0acc0c0dd5000899299981818059bac302130323754604260646ea809054ccc0c0cc038c084c0c8dd5012181098191baa02d1533303033010301130323754604260646ea8090cdc01bad30123032375405a907ff7d9290a99981819999809801981118191baa02d375c603060646ea80b4dd7180898191baa02d375a601e60646ea80b44ccccc04c004c028c0c8dd50169bae30193032375405a6eb8c068c0c8dd50169803a41900229405280a5014a0606860626ea800458cc018dd6180418181baa301f303037540440066064605e6ea800458cc010dd6180318171baa301d302e37540406eb4c0c4008dd69818181880098161baa02115323233302c30270181323232533302f302b3030375400226464a666062605a60646ea80044c94ccc0c8c034dd61811981a1baa30233034375404c2a66606466020604660686ea8098c08cc0d0dd50178a999819198091809981a1baa30233034375404c66e00dd6980a181a1baa02f483fede64a454ccc0c94ccc0c8c020dd7180d981a1baa02f13007375c603860686ea80bc5280a9998191999980a8019812181a1baa02f375c603660686ea80bcdd7180e181a1baa02f3370066e0ccdc11bad301d3034375405e902824190026eb4c044c0d0dd501789999980a8009806181a1baa02f375c603660686ea80bcdd7180e181a1baa02f300948320045280a9998191999980a8019812181a1baa02f375c603460686ea80bcdd71809981a1baa02f375a602260686ea80bc54ccc0c8ccccc05400cc090c0d0dd50179bae301b3034375405e6eb8c070c0d0dd501799b83337046eb4c074c0d0dd5017a40a090640089999980a8009806181a1baa02f375c603660686ea80bcdd7180e181a1baa02f300948320045280a5014a02940528181b18199baa00116330083758601460646ea8c084c0c8dd5012001981a18189baa00116330063758601060606ea8c07cc0c0dd50111bad3033002375a60646066002605c6ea808c54ccc0b0c0880604c8c8c94ccc0bcc0acc0c0dd5000899192999818981698191baa0011325333032300d3758604660686ea8c08cc0d0dd50130a999819198081811981a1baa02630233034375405e2a66606466024602660686ea8c08cc0d0dd501319b80375a602860686ea80bd20ffe7dd0d1533303253330323008375c603660686ea80bc4c01cdd7180e181a1baa02f14a02a6660646666602a006604860686ea80bcdd7180d981a1baa02f375c603860686ea80bccdc019b83337046eb4c074c0d0dd5017a40f09064009bad30113034375405e26666602a002604860686ea80bcdd7180d981a1baa02f375c603860686ea80bcc02520c80114a02a6660646666602a006604860686ea80bcdd7180d181a1baa02f375c602660686ea80bcdd69808981a1baa02f153330323333301500330243034375405e6eb8c06cc0d0dd50179bae301c3034375405e66e0ccdc11bad301d3034375405e903c241900226666602a002601860686ea80bcdd7180d981a1baa02f375c603860686ea80bcc02520c80114a029405280a5014a0606c60666ea800458cc020dd6180518191baa302130323754048006606860626ea800458cc018dd6180418181baa301f303037540446eb4c0cc008dd69819181980098171baa0231533302c3370e900300c09919192999817981598181baa001132325333031302d30323754002264a666064601a6eb0c08cc0d0dd51811981a1baa026153330323301030233034375404c604660686ea80bc54ccc0c8cc048c04cc0d0dd51811981a1baa026375a602860686ea80bc54c8ccc0cd4ccc0ccc024dd7180e181a9baa03013008375c603a606a6ea80c05280a9998199999980b0021812981a9baa030375c6038606a6ea80c0dd7180e981a9baa0303370060029064009bad30123035375406026666602c004601a606a6ea80c0dd7180e181a9baa030375c603a606a6ea80c0cdc09bad301e3035375406060029064008a5015333033333330160043025303537540606eb8c06cc0d4dd50181bae3014303537540606eb4c048c0d4dd50180a9998199999980b0021812981a9baa030375c6038606a6ea80c0dd7180e981a9baa030300148320044ccccc058008c034c0d4dd50181bae301c303537540606eb8c074c0d4dd501819b81375a603c606a6ea80c0c00520c80114a02940dc199b82482d004dd6980e981a1baa02f14a02940528181b18199baa00116330083758601460646ea8c084c0c8dd5012001981a18189baa00116330063758601060606ea8c07cc0c0dd50111bad3033002375a60646066002605c6ea808c54ccc0b0cdc3a40100302646464a66605e605660606ea80044c8c94ccc0c4c0b4c0c8dd5000899299981918069bac302330343754604660686ea809854ccc0c8cc040c08cc0d0dd50131812181a1baa02f1533303233012301330343754604660686ea8098dd6980a181a1baa02f1533303233333015001300c3034375405e6eb8c068c0d0dd50179bae30133034375405e6eb4c044c0d0dd501789999980a8019811981a1baa02f375c603660686ea80bcdd7180e181a1baa02f375a603a60686ea80bc5280a5014a02940c0d8c0ccdd50008b198041bac300a30323754604260646ea809000cc0d0c0c4dd50008b198031bac300830303754603e60606ea8088dd698198011bad30323033001302e37540462646464a66605e66e1d200a01b13232325333032302e30333754002264a666066601c6eb0c090c0d4dd51812181a9baa027153330333301130243035375404e6048606a6ea80c054ccc0cccc04cc050c0d4dd51812181a9baa0273370066e00dd6980a981a9baa030375a600c606a6ea80c0dd69803981a9baa0301325333034302a30353754002264646464a66607066ebcc0a0cc0f0c0a4c0e8dd501a9981e1815181d1baa0353303c3012303a375406a66078603460746ea80d4cc0f0c02cc0e8dd501a9981e1806181d1baa0353303c3020303a375406a66078603260746ea80d4cc0f0c05cc0e8dd501a9981e1810981d1baa0353303c3022303a375406a66078604660746ea80d4cc0f0dd400425eb8001054ccc0e0cc0280180d854ccc0e000840045280a5014a066e24c074c070dd61814981c9baa005480294ccc0d94ccc0d8c030dd7180f981c1baa0331300b375c604060706ea80cc528099b8733301a3758605060706ea8010dd7180f181c1baa033375c602e60706ea80cccdc01bad3015303837540666eb4c084c0e0dd50198a99981b19b8733301a3758605060706ea8010dd7180f181c1baa033375c602e60706ea80ccdd6980a981c1baa03313370e6660346eb0c0a0c0e0dd50021bae301f303837540666eb8c080c0e0dd50199bad30213038375406629414ccc0d4c0c4c0d8dd5000899191919191919191919191919191919191919191919191919192999829182a801099191924c609402e609203060900322c6eb4c14c004c14c008dd6982880098288011bae304f001304f002375c609a002609a0046eb4c12c004c12c008dd7182480098248011bae30470013047002375a608a002608a0046eb4c10c004c10c008dd698208009820801181f800981f801181e800981e801181d800981b9baa001163039303637540022c601a606a6ea80045280a5014a0606e60686ea800458cc024dd6180598199baa30223033375404a6eb4c0d8008dd6981a981b00098189baa026132325333031302d3032375400226464a666066605e60686ea80044c94ccc0d0cdd78109812981b1baa0031533303433012302530363754050604c606c6ea80c454ccc0d0cc88c94ccc0dcc0c8c0e0dd5000899b88002375a607860726ea800458c09cc0e0dd51813981c1baa002301530363754604a606c6ea80a0cdc019b80375a602c606c6ea80c4dd69803981b1baa031375a6010606c6ea80c44ccccc05c004c038c0d8dd50189bae301c303637540626eb8c054c0d8dd50189bad30133036375406229405280a503038303537540022c660146eb0c030c0d0dd51811981a1baa0260033036303337540022c66010660466eb0c084c0c8dd5181098191baa0242330033023303337540020400026eb4c0d0c0c4dd501311192999818981618191baa00113371e6eb8c0d8c0ccdd50008010a50302130323754604260646ea80088c0ccc0d0c0d0c0d0c0d00048c0c8c0ccc0ccc0ccc0ccc0cc004dc79bae300c302d37540506e3cdd7180918161baa027370666e092014375a602860566ea8098c0040048894ccc0b40085300103d87a800013232533302c30280031301c330300024bd70099980280280099b8000348004c0c400cc0bc0088c0b0c0b4c0b40048c084c008cc06400494ccc09cc088c0a0dd5180c18149baa301830293754603260526ea80045288a5030010012253330280011480004cdc0240046600400460560024464a66604a6042604c6ea80044cc88c8cc00400400c894ccc0b0004528099299981519b8f375c605e00400829444cc00c00c004c0bc004dd6180218139baa003375c6054604e6ea800458c054c098dd5000918139814181418141814181418141814181400091192999811980f18121baa0011337106eb4c0a0c094dd50008010b180998121baa3014302437540044604a604c604c604c604c604c604c604c00246048604a604a604a0024444464a66604666ebcc050c094dd50030028a99981199b873330073758602a604a6ea801801000c00840045280a50337126010600e6eb0c050c090dd5002a401444464a666040603660426ea8004520001375a604a60446ea8004c94ccc080c06cc084dd50008a6103d87a8000132330010013758604c60466ea8008894ccc094004530103d87a8000132323253330253371e00e6eb8c0a800c4c054cc0a4dd4000a5eb804cc014014008dd69814981500118148011bac3027001323300100100422533302400114c103d87a8000132323253330243371e00e6eb8c0a400c4c050cc0a0dd3800a5eb804cc014014008dd61814181480118140011bac30260012323300100100222533302100114bd7009919991119198008008019129998138008801899198149ba733029375200c660526054002660526054605600297ae033003003302b002375860520026eb8c090004dd6181218128009980180198128011bac3023001300100122533301e0011480004cdc0240046600400460420024603c603e603e603e603e603e603e0024603a603c603c603c603c603c603c603c603c603c00246038603a603a603a603a603a603a603a603a603a603a0024603660386038603860386038603860386038603860386038002602a6ea802cc060c054dd50008a5030043014375400c6644a666026601c60286ea80084c8c94ccc054c044c058dd5000899299980b1808980b9baa0011375c603660306ea800458c018c05cdd51803180b9baa3007301737546034602e6ea800458c94ccc060004530103d87a80001300533019301a0014bd7019803801119baf3006301737540020046030602a6ea800858c00cc04cdd50029bac300230133754600460266ea8014dd2a40004602a00246028602a00244646600200200644a666028002297ae01323253330133005002133017002330040040011330040040013018002301600114984d958c94ccc030c0200044c8c8c8c94ccc04cc05800852616375a602800260280046eb4c048004c038dd50018a99980618038008991919192999809980b0010a4c2c6eb4c050004c050008dd6980900098071baa0031533300c300200113232323253330133016002149858dd6980a000980a0011bad3012001300e37540062a66601866e1d200600113232323253330133016002149858dd6980a000980a0011bad3012001300e37540062a66601866e1d200800113232323253330133016002149858dd6980a000980a0011bad3012001300e37540062a66601866e1d200a00113232323253330133016002149858dd6980a000980a0011bad3012001300e37540062a66601866e1d200c0011323253330113014002149858dd6980900098071baa00316300c37540046e1d2004533300830043009375400a2646464646464646464646464646464646464646464646464a666046604c004264646493180d80a980d00b180c80b8b1bad30240013024002375c604400260440046eb8c080004c080008dd6980f000980f0011bae301c001301c002375c603400260340046eb4c060004c060008dd6980b000980b0011bad301400130140023012001301200230100013010002300e001300a375400a2c4a666010600860126ea80044c8c8c8c94ccc03cc0480084c8c92632533300e300a0011323253330133016002132498c94ccc044c0340044c8c94ccc058c0640084c926300d001163017001301337540042a66602260180022646464646464a666034603a0042930b1bad301b001301b002375a603200260320046eb4c05c004c04cdd50010b18089baa001163014001301037540062a66601c60120022a66602260206ea800c5261616300e3754004600c0062c60200026020004601c00260146ea8004588c94ccc020c0100044c8c94ccc034c04000852616375c601c00260146ea800854ccc020c00c0044c8c94ccc034c04000852616375c601c00260146ea800858c020dd50009b8748008dc3a40006eb80055cd2ab9d5573caae7d5d02ba15745";

const getLucid = async (address) => {
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

function buildRedeemerDatum(requestor, windowType, opts) {
    const LessonAcceptedRedeemer = Data.Enum([
        Data.Object("StudentCancel24Hours", {
            teacherOutputIndex: Data.Integer(),
            serviceOutputIndex: Data.Integer(),
        }),
        Data.Object("StudentCancel12Hours", {
            teacherOutputIndex: Data.Integer(),
            serviceOutputIndex: Data.Integer(),
        }),
        Data.Object("StudentCancel4Hours", {
            teacherOutputIndex: Data.Integer(),
            serviceOutputIndex: Data.Integer(),
        }),
        Data.Object("StudentCancelLessThan4Hours", {
            teacherOutputIndex: Data.Integer(),
            serviceOutputIndex: Data.Integer(),
        }),
        Data.Object("TeacherCancel", {
            studentOutputIndex: Data.Integer(),
            serviceOutputIndex: Data.Integer(),
        })
    ]);
    const {
        teacherOutputIndex = 0n,
        serviceOutputIndex = 1n,
        studentOutputIndex = 0n,
    } = opts || {};

    if (requestor === 'student') {
        const base = { teacherOutputIndex, serviceOutputIndex };
        switch (windowType) {
            case '24h':
                return Data.to({ StudentCancel24Hours: base }, LessonAcceptedRedeemer);
            case '12h':
                return Data.to({ StudentCancel12Hours: base }, LessonAcceptedRedeemer);
            case '4h':
                return Data.to({ StudentCancel4Hours: base }, LessonAcceptedRedeemer);
            case '<4h':
                return Data.to(
                    { StudentCancelLessThan4Hours: base },
                    LessonAcceptedRedeemer
                );
            default:
                throw new Error("Invalid windowType for student cancel");
        }
    }

    if (requestor === 'teacher') {
        return Data.to(
            {
                TeacherCancel: {
                    studentOutputIndex,
                    serviceOutputIndex,
                },
            },
            LessonAcceptedRedeemer
        );
    }

    throw new Error("Invalid requestor");
}

function computeCancelOutputs(
  lockUnit,
  lessonPaymentUnit,
  lockAmount,
  priceAmount,
  who, // 'student' | 'teacher'
  windowType) {
  const teacher = {};
  const student = {};
  const admin = {};
  const sameToken = lockUnit === lessonPaymentUnit;

  const tenPct  = (priceAmount * 10n) / 100n;
  const fortyPct = (priceAmount * 40n) / 100n;
  const sixtyPct = (priceAmount * 60n) / 100n;
  const ninetyPct = (priceAmount * 90n) / 100n;

  if (who === 'student') {
    if (windowType === '24h') {
      teacher[lockUnit] = (teacher[lockUnit] || 0n) + lockAmount;
      admin[lessonPaymentUnit] = (admin[lessonPaymentUnit] || 0n) + tenPct;
    }

    if (windowType === '12h') {
      if (sameToken) {
        teacher[lessonPaymentUnit] =
          (teacher[lessonPaymentUnit] || 0n) + lockAmount + fortyPct;
        admin[lessonPaymentUnit] =
          (admin[lessonPaymentUnit] || 0n) + tenPct;
      } else {
        teacher[lockUnit] = (teacher[lockUnit] || 0n) + lockAmount;
        teacher[lessonPaymentUnit] =
          (teacher[lessonPaymentUnit] || 0n) + fortyPct;
        admin[lessonPaymentUnit] =
          (admin[lessonPaymentUnit] || 0n) + tenPct;
      }
    }

    if (windowType === '4h') {
      if (sameToken) {
        teacher[lessonPaymentUnit] =
          (teacher[lessonPaymentUnit] || 0n) + lockAmount + sixtyPct;
        teacher[lessonPaymentUnit] =
          (teacher[lessonPaymentUnit] || 0n) + tenPct;
      } else {
        teacher[lockUnit] =
          (teacher[lockUnit] || 0n) + lockAmount;
        teacher[lessonPaymentUnit] =
          (teacher[lessonPaymentUnit] || 0n) + sixtyPct;
        admin[lessonPaymentUnit] =
          (admin[lessonPaymentUnit] || 0n) + tenPct;
      }
    }

    if (windowType === '<4h') {
      if (sameToken) {
        teacher[lessonPaymentUnit] =
          (teacher[lessonPaymentUnit] || 0n) + lockAmount + ninetyPct;
        const tenRest = priceAmount - ninetyPct;
        admin[lessonPaymentUnit] =
          (admin[lessonPaymentUnit] || 0n) + tenRest;
      } else {
        teacher[lockUnit] =
          (teacher[lockUnit] || 0n) + lockAmount;
        teacher[lessonPaymentUnit] =
          (teacher[lessonPaymentUnit] || 0n) + ninetyPct;
        const tenRest = priceAmount - ninetyPct;
        admin[lessonPaymentUnit] =
          (admin[lessonPaymentUnit] || 0n) + tenRest;
      }
    }
  }

  if (who === 'teacher') {
    admin[lockUnit] = (admin[lockUnit] || 0n) + lockAmount;
    student[lessonPaymentUnit] =
      (student[lessonPaymentUnit] || 0n) + priceAmount;
  }

  return { teacher, student, admin };
}

function decideWindowType(nowMs, lessonStartTimeMs) {
    const TWENTY_FOUR_H = 86400000; // 24h
    const TWELVE_H = 43200000;      // 12h
    const FOUR_H = 14400000;        // 4h

    if (nowMs < lessonStartTimeMs - TWENTY_FOUR_H)
        return "24h";
    if (nowMs < lessonStartTimeMs - TWELVE_H)
        return "12h";
    if (nowMs < lessonStartTimeMs - FOUR_H)
        return "4h";
    if (nowMs < lessonStartTimeMs)
        return "<4h";
    throw new Error("Lesson has already started; cancellation not allowed.");
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
    const { studentAddress, teacherAddress, requestor, lessonData, lessonPaymentUnit = 'lovelace' } = req.body;
    if (!lessonData.acceptedTxHash)
      throw new Error("Accepted transaction hash is required in lesson data");
    if (!requestor || (requestor !== 'student' && requestor !== 'teacher'))
      throw new Error("Requestor must be either 'student' or 'teacher'");

    // Derive validator address from compiled Plutus script
    const requestAcceptedScript = {
      type: "PlutusV3",
      script: REQUEST_ACCEPTED_SCRIPT_COMPILED_CODE?.trim(),
    };
    if (!requestAcceptedScript.script)
        throw new Error("Plutus script not configured");
    const requestAcceptedValidatorAddress = validatorToAddress(
      process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK,
      requestAcceptedScript
    );
    console.log("Validator address:", requestAcceptedValidatorAddress);

    // Define lock data
    const lockUnit = process.env.NEXT_PUBLIC_LESSON_LOCK_ASSET_UNIT || "lovelace";
    const lockAmount = parseInt(process.env.NEXT_PUBLIC_LESSON_LOCK_LOVELACE_AMOUNT || "10000000");
    if (lockAmount <= 0) {
      throw new Error("Invalid lesson lock lovelace amount configured");
    }

    // Fetch student's UTXOs and build transaction
    const requestorAddress = requestor === 'student' ? studentAddress : teacherAddress;
    const lucid = await getLucid(requestorAddress);
    const utxos = await lucid.utxosAt(requestAcceptedValidatorAddress);
    const inputUtxo = utxos.find((utxo) => utxo.txHash === lessonData.acceptedTxHash);
    if (!inputUtxo) {
      throw new Error("Input UTXO not found in teacher's address");
    }

    // Build transaction amounts
    const lessonPrice = BigInt(Math.round((lessonData.price / 100) * 1_000_000));
    const windowType = decideWindowType(Date.now(), lessonData.scheduledUnixtime * 1000);
    console.log(`Determined cancellation window type: ${windowType}`);
    const outputs = computeCancelOutputs(lockUnit, lessonPaymentUnit, BigInt(lockAmount), lessonPrice, requestor, windowType);
    console.log("Computed cancellation outputs:", outputs);

    // Build redeemer datum
    const redeemerDatum = buildRedeemerDatum(requestor, windowType);
    if (!redeemerDatum) {
      throw new Error("Failed to build redeemer datum");
    }

    // Create transaction
    let tx = lucid
      .newTx()
      .collectFrom([inputUtxo], redeemerDatum);
    if (outputs.teacher && Object.keys(outputs.teacher).length > 0) {
      tx = tx.pay.ToAddress(teacherAddress, outputs.teacher);
    }
    if (outputs.student && Object.keys(outputs.student).length > 0) {
      tx = tx.pay.ToAddress(studentAddress, outputs.student);
    }
    if (outputs.admin && Object.keys(outputs.admin).length > 0) {
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
        tx = tx.pay.ToAddress(adminAddress, outputs.admin);
    }
    tx = await tx.addSigner(teacherAddress)
        .complete();

    return res.status(200).json({
      success: true,
      txCbor: tx.toCBOR(),
    });
  } catch (err) {
    console.error("API error in /api/lessons/accept:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
}
