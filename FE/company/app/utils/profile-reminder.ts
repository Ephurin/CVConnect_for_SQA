const DONT_ASK_AGAIN_KEY = "dont_ask_again";

export function setDontAskAgain(id: any) {
  const localArr = localStorage.getItem(DONT_ASK_AGAIN_KEY);

  const arr = localArr ? JSON.parse(localArr) : [];
  if (!arr.includes(id)) {
    arr.push(id);
  }
  localStorage.setItem(DONT_ASK_AGAIN_KEY, JSON.stringify(arr));
}

export function checkDontAskAgain(id: any) {
  const localArr = localStorage.getItem(DONT_ASK_AGAIN_KEY);
  if (!localArr) {
    return false;
  }
  const arr = JSON.parse(localArr);
  return arr.includes(id);
}
