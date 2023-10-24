/* Example of Using Marlowe Runtime with a CIP30 Wallet */

"use strict";

// Use a Bech32 library for converting address formats.

import { bech32 } from "bech32";

import renderjson from "renderjson";

export const b32 = bech32;

// Connection to the CIP30 wallet.
var nami = null;

// Address of the depositor.
var address = null;

// Identifier for the contract.
var contractId = null;

// URL for Marlowe Runtime's /contracts endpoint.
var contractUrl = null;

// URL for Marlowe Runtime's /contract/*/transactions endpoint.
var transactionUrl = null;

// The JSON for the Marlowe contract.
var contract = {};

// Poll every five seconds.
const delay = 5000;

// One ada is one million lovelace.
const ada = 1000000;

/**
 * Set the wallet's address in the UI.
 * @param [String] a The hexadecimal bytes for the address.
 */
function setAddress(a) {
  const bytes = [];
  for (let c = 0; c < a.length; c += 2)
    bytes.push(parseInt(a.substr(c, 2), 16));
  address = bech32.encode("addr_test", bech32.toWords(bytes), 1000);
  const display =
    address.substr(0, 20) + "..." + address.substr(address.length - 15);
  uiAddress.innerHTML =
    "<a href='https://preprod.cardanoscan.io/address/" +
    a +
    "' target='marlowe'>" +
    address +
    "</a>";
  // uiAddress.innerHTML = "<a href='https://preprod.cardanoscan.io/address/" + a + "' target='marlowe'>" + display + "</a>"
}

/**
 * Set the contract ID in the UI.
 * @param [String] c The contract ID.
 */
function setContract(c) {
  contractId = c;
  uiContractId.innerHTML =
    "<a href='https://preprod.marlowescan.com/contractView?tab=info&contractId=" +
    contractId.replace("#", "%23") +
    "' target='marlowe'>" +
    contractId +
    "</a>";
}

/**
 * Set a link to a transaction in the UI.
 * @param [Element] element The UI element for the transaction.
 * @param [String]  tx      The transaction ID.
 */
function setTx(element, tx) {
  const display = tx.substr(0, 18) + "..." + tx.substr(tx.length - 18);
  element.innerHTML =
    "<a href='https://preprod.cardanoscan.io/transaction/" +
    tx +
    "?tab=utxo' target='marlowe'>" +
    display +
    "</a>";
}

/**
 * Make the JSON for the Marlowe contract.
 */
export function makeContract() {
  contract = {
    when: [
      {
        then: {
          when: [
            {
              then: {
                token: {
                  token_name: "T-minus_USD",
                  currency_symbol:
                    "fe239e3c37753d02f32dcddd5cacbad2ee977b8c95e6ced7c2c10f55",
                },
                to: {
                  party: {
                    role_token: "Seller",
                  },
                },
                then: {
                  when: [
                    {
                      then: {
                        token: {
                          token_name: "",
                          currency_symbol: "",
                        },
                        to: {
                          party: {
                            role_token: "Seller",
                          },
                        },
                        then: {
                          token: {
                            token_name: "T-minus_USD",
                            currency_symbol:
                              "fe239e3c37753d02f32dcddd5cacbad2ee977b8c95e6ced7c2c10f55",
                          },
                          to: {
                            party: {
                              role_token: "Buyer",
                            },
                          },
                          then: "close",
                          pay: 3000,
                          from_account: {
                            role_token: "Seller",
                          },
                        },
                        pay: 10000000000,
                        from_account: {
                          role_token: "Buyer",
                        },
                      },
                      case: {
                        party: {
                          role_token: "Buyer",
                        },
                        of_token: {
                          token_name: "",
                          currency_symbol: "",
                        },
                        into_account: {
                          role_token: "Buyer",
                        },
                        deposits: 10000000000,
                      },
                    },
                  ],
                  timeout_continuation: {
                    token: {
                      token_name: "T-minus_USD",
                      currency_symbol:
                        "fe239e3c37753d02f32dcddd5cacbad2ee977b8c95e6ced7c2c10f55",
                    },
                    to: {
                      party: {
                        role_token: "Seller",
                      },
                    },
                    then: "close",
                    pay: 3000,
                    from_account: {
                      role_token: "Seller",
                    },
                  },
                  timeout: Date.parse(uiReleaseTime.value),
                },
                pay: 200,
                from_account: {
                  role_token: "Buyer",
                },
              },
              case: {
                party: {
                  role_token: "Buyer",
                },
                of_token: {
                  token_name: "T-minus_USD",
                  currency_symbol:
                    "fe239e3c37753d02f32dcddd5cacbad2ee977b8c95e6ced7c2c10f55",
                },
                into_account: {
                  role_token: "Buyer",
                },
                deposits: 200,
              },
            },
          ],
          timeout_continuation: {
            token: {
              token_name: "T-minus_USD",
              currency_symbol:
                "fe239e3c37753d02f32dcddd5cacbad2ee977b8c95e6ced7c2c10f55",
            },
            to: {
              party: {
                role_token: "Seller",
              },
            },
            then: "close",
            pay: 3000,
            from_account: {
              role_token: "Seller",
            },
          },
          timeout: Date.parse(uiBuyerDepositTime.value),
        },
        case: {
          party: {
            role_token: "Seller",
          },
          of_token: {
            token_name: "T-minus_USD",
            currency_symbol:
              "fe239e3c37753d02f32dcddd5cacbad2ee977b8c95e6ced7c2c10f55",
          },
          into_account: {
            role_token: "Seller",
          },
          deposits: 3000,
        },
      },
    ],
    timeout_continuation: "close",
    timeout: Date.parse(uiSellerDepositTime.value),
  };
  console.log({ contract: contract });
  // uiContract.replaceChildren(window.renderjson.set_show_to_level(10)(contract));

  if (window.renderjson && window.renderjson.set_show_to_level) {
    uiContract.replaceChildren(
      window.renderjson.set_show_to_level(10)(contract)
    );
  } else {
    console.error("renderjson is not initialized");
  }

  // uiContract.innerText = JSON.stringify(contract)
}

/**
 * Perform an operation that requires blocking the UI.
 */
function waitCursor() {
  document.body.style.cursor = "wait";
  uiCreate.style.cursor = "wait";
  uiSellerDepositU.style.cursor = "wait";
  uiBuyerDepositU.style.cursor = "wait";
  uiSellerWithdrawU.style.cursor = "wait";
  uiBuyerDepositA.style.cursor = "wait";
  uiSellerWithdrawA.style.cursor = "wait";
  uiBuyerWithdrawU.style.cursor = "wait";

  uiMessage.innerText = "Working . . .";
}

/**
 * Report a result and unblock the UI.
 */
function report(message) {
  document.body.style.cursor = "default";
  uiCreate.style.cursor = "default";
  uiSellerDepositU.style.cursor = "default";
  uiBuyerDepositU.style.cursor = "default";
  uiSellerWithdrawU.style.cursor = "default";
  uiBuyerDepositA.style.cursor = "default";
  uiSellerWithdrawA.style.cursor = "default";
  uiBuyerWithdrawU.style.cursor = "default";
  status(message);
}

/**
 * Show a status message in the UI.
 * @param [String] message The message.
 */
function status(message) {
  uiMessage.innerText = message;
}

/**
 * Build a Marlowe transaction.
 * @param [String]   operation The name of the operation being performed.
 * @param [Object]   req       The HTTP request.
 * @param [String]   url       The endpoint's URL.
 * @param [String]   accept    The "accept" HTTP header.
 * @param [Function] followup  Actions to perform after the transaction is built.
 */
async function buildTransaction(operation, req, url, accept, followup) {
  waitCursor();
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      console.log({
        operation: operation,
        status: this.status,
        response: this.responseText,
      });
      if (this.status == 201) {
        const res = JSON.parse(this.responseText);
        followup(res);
      } else {
        report("Transaction building failed.");
      }
    }
  };
  xhttp.open("POST", url);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.setRequestHeader("Accept", accept);
  console.log("address: " + address);
  xhttp.setRequestHeader("X-Change-Address", address);
  console.log({ operation: operation, request: req });
  status("Building transaction.");
  console.log(JSON.stringify(req));
  xhttp.send(JSON.stringify(req));
}

/**
 * Create the contract.
 */
// , roles : { Seller : uiSeller.value, Buyer : uiBuyer.value }

export async function createContract() {
  buildTransaction(
    "create",
    {
      version: "v1",
      contract: contract,
      roles: { Seller: uiSeller.value, Buyer: uiBuyer.value },
      minUTxODeposit: 2 * ada,
      metadata: {},
      tags: {},
    },
    uiRuntime.value + "/contracts",
    "application/vendor.iog.marlowe-runtime.contract-tx-json",
    function (res) {
      uiSeller.disabled = true;
      uiBuyer.disabled = true;
      uiSellerDepositU.disabled = true;
      uiBuyerDepositU.disabled = true;
      uiSellerWithdrawU.disabled = true;
      uiBuyerDepositA.disabled = true;
      uiSellerWithdrawA.disabled = true;
      uiBuyerWithdrawU.disabled = true;
      uiReleaseTime.disabled = true;
      // setContract(res.resource.contractId)

      contractUrl = uiRuntime.value + "/" + res.links.contract;
      const followup = function () {
        setTx(uiCreateTx, contractId.replace(/#.*$/, ""));
      };
      submitTransaction(
        res.resource.tx.cborHex,
        contractUrl,
        waitForConfirmation(contractUrl, followup)
      );
    }
  );
}

/**
 * Apply inputs to the contract.
 */
async function applyInputs(operation, inputs, followup) {
  contractUrl = uiRuntime.value + "/" + uiContractId.value;
  // contractUrl =
  //   "http://66.42.38.116:3780/contracts/5ca7d3040694f2f8a4746e23ae22c7bb350a0d508a6d28c0c2ff436c9be01f98%231";
  console.log(contractUrl);
  // yaml2json
  buildTransaction(
    operation,
    {
      version: "v1",
      inputs: inputs,
      metadata: {},
      tags: {},
    },
    contractUrl + "/transactions",
    "application/vendor.iog.marlowe-runtime.apply-inputs-tx-json",
    function (res) {
      transactionUrl = uiRuntime.value + "/" + res.links.transaction;
      const tx = res.resource.transactionId;
      console.log(tx);
      submitTransaction(
        res.resource.tx.cborHex,
        transactionUrl,
        waitForConfirmation(transactionUrl, followup(tx))
      );
    }
  );
}

/**
 * WITHDRAWALS
 */
async function Withdrawals(contractId, role, followup) {
  console.log("contractId", contractId, "role", role, "followup", followup);
  console.log("Withdrawals success.");
  buildTransaction(
    "withdrawals",
    {
      contractId: contractId,
      role: role,
    },
    uiRuntime.value + "/withdrawals",
    "application/vendor.iog.marlowe-runtime.withdraw-tx-json",
    function (res) {
      console.log("res: ", res);
      transactionUrl = uiRuntime.value + "/" + res.links.withdrawal;
      console.log("transactionUrl: ", transactionUrl);
      const tx = res.resource.withdrawalId;
      console.log("tx: ", tx);
      submitTransaction(
        res.resource.tx.cborHex,
        transactionUrl,
        waitForConfirmation(transactionUrl, followup(tx))
      );
    }
  );
}

export async function sellerWithdrawUSD() {
  // Seller NAMI
  Withdrawals(
    "5ca7d3040694f2f8a4746e23ae22c7bb350a0d508a6d28c0c2ff436c9be01f98#1",
    "Seller",
    function (tx) {
      return function () {
        setTx(uiSellerWithdrawUTx, tx);
        uiSellerWithdrawU.disabled = true;
      };
    }
  );
}

export async function sellerWithdrawADA() {
  // Seller NAMI
  Withdrawals(
    "5ca7d3040694f2f8a4746e23ae22c7bb350a0d508a6d28c0c2ff436c9be01f98#1",
    "Seller",
    function (tx) {
      return function () {
        setTx(uiSellerWithdrawATx, tx);
        uiSellerWithdrawA.disabled = true;
      };
    }
  );
}

export async function buyerWithdrawUSD() {
  // Buyer NAMI
  Withdrawals(
    "5ca7d3040694f2f8a4746e23ae22c7bb350a0d508a6d28c0c2ff436c9be01f98#1",
    "Buyer",
    function (tx) {
      return function () {
        setTx(uiBuyerWithdrawUTx, tx);
        uiBuyerWithdrawU.disabled = true;
      };
    }
  );
}

/**
 * DEPOSIT
 */
export async function sellerDepositUSD(amount) {
  // Seller NAMI
  applyInputs(
    "deposit",
    [
      {
        input_from_party: { role_token: "Seller" },
        into_account: { role_token: "Seller" },
        of_token: {
          currency_symbol:
            "fe239e3c37753d02f32dcddd5cacbad2ee977b8c95e6ced7c2c10f55",
          token_name: "T-minus_USD",
        },
        that_deposits: amount,
      },
    ],
    function (tx) {
      return function () {
        setTx(uiSellerDepositUTx, tx);
        uiSellerDepositU.disabled = true;
      };
    }
  );
}

export async function buyerDepositUSD(amount) {
  // Buyer NAMI
  applyInputs(
    "deposit",
    [
      {
        input_from_party: { role_token: "Buyer" },
        into_account: { role_token: "Buyer" },
        of_token: {
          currency_symbol:
            "fe239e3c37753d02f32dcddd5cacbad2ee977b8c95e6ced7c2c10f55",
          token_name: "T-minus_USD",
        },
        that_deposits: amount,
      },
    ],
    function (tx) {
      return function () {
        setTx(uiBuyerDepositUTx, tx);
        uiBuyerDepositU.disabled = true;
      };
    }
  );
}

export async function buyerDepositADA(amount) {
  // Buyer NAMI
  applyInputs(
    "deposit",
    [
      {
        input_from_party: { role_token: "Buyer" },
        into_account: { role_token: "Buyer" },
        of_token: { currency_symbol: "", token_name: "" },
        that_deposits: amount,
      },
    ],
    function (tx) {
      return function () {
        setTx(uiBuyerDepositATx, tx);
        uiBuyerDepositA.disabled = true;
      };
    }
  );
}

/**
 * Release the funds from the contract.
 */
export async function releaseFunds() {
  applyInputs("release", [], function (tx) {
    return function () {
      setTx(uiReleaseTx, tx);
      uiRelease.disabled = true;
    };
  });
}

/**
 * Submit a transaction.
 * @param [String]   cborHex The hexadecimal-encoded CBOR for the transaction.
 * @param [String]   url     The URL for the Marlowe Runtime endpoint for submitting the transaction.
 * @param [Function] wait    Action to be performed for waiting for the confirmation.
 */
function submitTransaction(cborHex, url, wait) {
  status("Signing transaction.");
  nami
    .signTx(cborHex, true)
    .then(function (witness) {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          console.log({
            operation: "submit",
            status: this.status,
            response: this.responseText,
          });
          if (this.status == 202) {
            setTimeout(wait, delay);
          } else {
            report("Transaction submission failed.");
          }
        }
      };
      xhttp.open("PUT", url);
      xhttp.setRequestHeader("Content-Type", "application/json");
      const req = {
        type: "ShelleyTxWitness BabbageEra",
        description: "",
        cborHex: witness,
      };
      console.log({ operation: "submit", request: req });
      status("Submitting transaction.");
      xhttp.send(JSON.stringify(req));
    })
    .catch(function (error) {
      report(error);
    });
}

/**
 * Wait for a transaction to be confirmed.
 */
function waitForConfirmation(url, followup) {
  return function () {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        console.log({
          operation: "wait",
          status: this.status,
          response: this.responseText,
        });
        if (this.status == 200) {
          const res = JSON.parse(this.responseText);
          console.log("wait for res: ", res);
          if (res.resource.status == "confirmed") {
            setTimeout(followup, delay);
            report("Transaction confirmed.");
          } else if (res.status == "confirmed") {
            setTimeout(followup, delay);
            report("Transaction confirmed.");
          } else if (res.resource.status == "submitted") {
            setTimeout(waitForConfirmation(url, followup), delay);
          } else if (res.status == "submitted") {
            setTimeout(waitForConfirmation(url, followup), delay);
          } else {
            report("Confirmation failed.");
          }
        }
      }
    };
    xhttp.open("GET", url);
    console.log({ operation: "wait" });
    status("Waiting for confirmation.");
    xhttp.send();
  };
}

/**
 * Initialize the application.
 */
export async function initialize() {
  uiRuntime.value = "http://66.42.38.116:3780";
  uiSeller.disabled = false;
  uiBuyer.disabled = false;
  uiSellerDepositU.disabled = false;
  uiBuyerDepositU.disabled = false;
  uiSellerWithdrawU.disabled = false;
  uiBuyerDepositA.disabled = false;
  uiSellerWithdrawA.disabled = false;
  uiBuyerWithdrawU.disabled = false;
  uiReleaseTime.disabled = false;

  if (uiContractId.value != "") {
    uiCreate.disabled = true;
    // let uiSDU = "25435370bdec4f2e9e16f5e8a7efd3553287eb21733764878814360edfd946cc"
    // let uiBDU = "875582804a5ac31c82b4c1e8689dc466d1f236c158af7bc5fcc257a76e69744a"
    // let uiSWU = "97a9015598953b57211b395dab116f4c18ad01a7a775634d90a922b11348875e"
    // let uiBDA = "6b8589f4005cac5347a155354cef317aa3c35a98a8b8d34495d17a23856cccc5"
    // let uiSWA = "38e9fb87e4c875cabe8c60367939d2e1db640c75a1fb642b1c5491140db6a45a"
    // let uiBWU = "c8ee396d7c1502f106d9fa5681a31f493c296b7f356147436dc582ddde8eea39"
    let uiSDU =
      "b09c06dee745850896613cc3dadaf94374035b82194843de03dd68a918e35734";
    let uiBDU =
      "bc11f442a43890f885e17fc1df5204e0657e48fcc17f757a30a23f34c130e7ce";
    let uiSWU = "";
    let uiBDA =
      "1c45cb695d0f46e2bee9259f7381ba284680b01f01ae93b71ef8d987ab40e498";
    let uiSWA = "";
    let uiBWU =
      "e314b13d2fa515193aaeef5798824cea2a183462fe27e1af4a1ba181368734e4";

    uiCreateTx.innerHTML =
      "<a href='https://preprod.marlowescan.com/contractView?tab=info&contractId=" +
      uiContractId.value.replace("#", "%23") +
      "' target='marlowe'>" +
      uiContractId.value +
      "</a>";

    if (uiSDU != "") uiSellerDepositU.disabled = true;
    uiSellerDepositUTx.innerHTML =
      "<a href='https://preprod.marlowescan.com/contractView?tab=info&contractId=" +
      uiContractId.value.replace("#", "%23") +
      "' target='marlowe'>" +
      uiSDU +
      "</a>";

    if (uiBDU != "") uiBuyerDepositU.disabled = true;
    uiBuyerDepositUTx.innerHTML =
      "<a href='https://preprod.marlowescan.com/contractView?tab=info&contractId=" +
      uiContractId.value.replace("#", "%23") +
      "' target='marlowe'>" +
      uiBDU +
      "</a>";

    if (uiSWU != "") uiSellerWithdrawU.disabled = true;
    uiSellerWithdrawUTx.innerHTML =
      "<a href='https://preprod.cardanoscan.io/transaction/" +
      uiSWU +
      "' target='marlowe'>" +
      uiSWU +
      " (CS)</a><br><a href='" +
      uiRuntime.value +
      "/withdrawals/" +
      uiSWU +
      "' target='marlowe'>" +
      uiSWU +
      " (MB)</a>";

    if (uiBDA != "") uiBuyerDepositA.disabled = true;
    uiBuyerDepositATx.innerHTML =
      "<a href='https://preprod.marlowescan.com/contractView?tab=info&contractId=" +
      uiContractId.value.replace("#", "%23") +
      "' target='marlowe'>" +
      uiBDA +
      "</a>";

    if (uiSWA != "") uiSellerWithdrawA.disabled = true;
    uiSellerWithdrawATx.innerHTML =
      "<a href='https://preprod.cardanoscan.io/transaction/" +
      uiSWA +
      "' target='marlowe'>" +
      uiSWA +
      " (CS)</a><br><a href='" +
      uiRuntime.value +
      "/withdrawals/" +
      uiSWA +
      "' target='marlowe'>" +
      uiSWA +
      " (MB)</a>";

    if (uiBWU != "") uiBuyerWithdrawU.disabled = true;
    uiBuyerWithdrawUTx.innerHTML =
      "<a href='https://preprod.cardanoscan.io/transaction/" +
      uiBWU +
      "' target='marlowe'>" +
      uiBWU +
      " (CS)</a><br><a href='" +
      uiRuntime.value +
      "/withdrawals/" +
      uiBWU +
      "' target='marlowe'>" +
      uiBWU +
      " (MB)</a>";
  }

  const sellerDepositTime = new Date();
  sellerDepositTime.setDate(sellerDepositTime.getDate() + 2);
  uiSellerDepositTime.value = sellerDepositTime.toISOString();

  const buyerDepositTime = new Date();
  buyerDepositTime.setDate(buyerDepositTime.getDate() + 4);
  uiBuyerDepositTime.value = buyerDepositTime.toISOString();

  const releaseTime = new Date();
  releaseTime.setDate(releaseTime.getDate() + 7);
  uiReleaseTime.value = releaseTime.toISOString();

  // Connect to the Nami wallet.
  cardano.nami
    .enable()
    .then(function (n) {
      nami = n;
      nami
        .getChangeAddress()
        .then(function (a) {
          setAddress(a);
          // uiBuyer.value = address
          makeContract();
        })
        .catch(function (error) {
          report(error);
        });
    })
    .catch(function (error) {
      report(error);
    });
}
