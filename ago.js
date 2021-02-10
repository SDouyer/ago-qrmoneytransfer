
// =========================== //
// ========= TO DO =========== //
// Donner un nom à votre application

const appName = "à remplacer par votre nom d'app";

// ==> APPELER POUR LANCER L'APP POUR LA PREMIERE FOIS

// ======= FIN TO DO ========= //
// =========================== //


function checkTransaction(users, from_id, amount, to_id) {

  // On teste si l'émetteur est inconnu. Si c'est le cas, on retourne un message d'erreur
  if (users[from_id] == undefined) {
    return { valid: false, error: "Emetteur inconnu" };
  }

  // =========================== //
  // ========= TO DO =========== //

  // Tester si le bénéficiaire est inconnu (reprendre le format ci-dessus)
  // Identifiant du bénéciaire : to_id
  // Return : retourner un message similaire à ci-dessus

  if (false) {         // A compléter (remplacer false)
    return {};    // A compléter
  }

  // ======= FIN TO DO ========= //
  // =========================== //


  // Solde de l'émetteur avant la transaction
  const balanceEmitter = users[from_id].balance;


  // =========================== //
  // ========= TO DO =========== //

  // Tester si le solde de l'émetteur balanceEmitter est insuffisant pour satisfaire la transaction.
  // => Tester si "balanceEmitter" est inférieur à "amount" (le montant de la transaction)

  if (false) {       // A compléter (remplacer false)
    return { valid: false, error: "Solde insuffisant de l'émetteur" };
  }

  // ======= FIN TO DO ========= //
  // =========================== //

  return {valid: true};
}


function generateQrLink(baseUrl, routeValidation, tx_id) {

  // =========================== //
  // ========= TO DO =========== //

  // Pour valider la transaction, il faut générer le lien unique de validation.
  // Ce lien est composé de
  // - baseUrl : l'URL (adresse web) de votre application
  // - routeValidation : le lien indiquant à votre serveur que c'est une validation de transaction
  // - tx_id : l'identifiant unique de votre transaction
  // => lien = baseUrl + routeValidation + tx_id

  const qr_link = "";        // Compléter le lien d'après les indications ci-dessus (remplacer "")

  // ======= FIN TO DO ========= //
  // =========================== //

  return qr_link
}


function checkValidation(users, transactions, tx_id) {
  // On vérifie que la transaction existe
  if (transactions[tx_id] == undefined) {
    return { valid: false, error: "La transaction est inconnue" };
  }
  const transaction = transactions[tx_id];

  const isAlreadyValidated = transaction.validated;
  const balanceEmitter = users[transaction.from].balance;
  const tx_amount = transaction.amount;

  // =========================== //
  // ========= TO DO =========== //

  // Renvoyer une erreur si isAlreadyValidated est vrai (transaction déjà validée)
  if (false) {    // Compléter la condition (remplacer false)
    return { valid: false, error: "La transaction a déjà été validée"};
  }

  // Renvoyer une erreur si le solde de l'émetteur (balanceEmitter) est inférieur au montant
  // de la transaction (tx_amount)
  if (false) {    // Compléter la condition (remplacer false)
    return { valid: false, error: "Fonds de l'émetteur insuffisants pour dénouer la transaction" };
  }

  // ======= FIN TO DO ========= //
  // =========================== //

  return {valid: true};
}


function getNewBalanceEmitter(old_balance, tx_amount) {
  // =========================== //
  // ========= TO DO =========== //
  // - old_balance = ancien solde de l'émetteur
  // - tx_amount = montant de la transaction

  const new_balance = 0;   // Compléter le nouveau solde de l'émetteur (remplacer 0)

  // ======= FIN TO DO ========= //
  // =========================== //

  return new_balance;
}

function getNewBalanceBeneficiary(old_balance, tx_amount) {
  // =========================== //
  // ========= TO DO =========== //
  // - old_balance = ancien solde du bénéficiaire
  // - tx_amount = montant de la transaction

  const new_balance = 0;   // Compléter le nouveau solde du bénéficiaire (remplacer 0)

  // ======= FIN TO DO ========= //
  // =========================== //

  return new_balance;
}


exports.appName = appName;
exports.checkTransaction = checkTransaction;
exports.generateQrLink = generateQrLink;
exports.checkValidation = checkValidation;
exports.getNewBalanceEmitter = getNewBalanceEmitter;
exports.getNewBalanceBeneficiary = getNewBalanceBeneficiary;
