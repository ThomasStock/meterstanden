// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// But I removed confusing chars such as i, I, l, L, 1, 0, o, O
const makeId = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export default makeId;
