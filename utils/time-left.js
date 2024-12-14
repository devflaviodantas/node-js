function time_left(timeLeft) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (minutes > 0 && seconds > 0) {
    return `${minutes} minuto${minutes > 1 ? "s" : ""} e ${seconds} segundo${seconds > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
  } else {
    return `${seconds} segundo${seconds > 1 ? "s" : ""}`;
  }
}

module.exports = { time_left };
