const isSupportedRegexpFlag = (flag) => {
  try {
    RegExp("", flag);
    return true;
  } catch {
    return false;
  }
};

isSupportedRegexpFlag('g');
isSupportedRegexpFlag('v');
