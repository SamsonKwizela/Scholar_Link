router.get("/internships", async (req, res) => {
  try {
    const internships = await Internship.find();

    res.status(200).json({
      internships,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});