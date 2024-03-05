const healthcheckController = (req, res) => {
  return res.status(200).json({ status: "ok" });
};
export default healthcheckController;
