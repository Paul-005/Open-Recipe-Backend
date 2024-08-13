const UserModal = require("../../modals/UserModal");

const followUser = async (req, res) => {
  try {
    const currentUser = await UserModal.findOne({ email: req.headers.token });

    const userToFollow = await UserModal.findById(req.params.userId);

    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }
    userToFollow.followers.push(currentUser._id);
    currentUser.following.push(userToFollow._id);
    await userToFollow.save();
    await currentUser.save();
    res.json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = followUser;
