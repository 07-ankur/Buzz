import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ msg: "Email is required.", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log(user);
    if (!user) {
      return res.json({ msg: "User not found", status: false });
    } else {
      return res.json({ msg: "User found", status: true, data: user });
    }
  } catch (err) {
    next(err);
  }
};

export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, about, image: profilePicture } = req.body;
    if (!email || !name || !profilePicture) {
      return res.send("Email, name and profile picture is required");
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.create({
      data: { email, name, about, profilePicture },
    });

    return res.json({ msg: "Success", status: true, user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        about: true,
        profilePicture: true,
      },
    });

    const usersGroupByInitialLetter = {};
    users.forEach((user) => {
      const initialLetter = user.name[0].toUpperCase();
      if (!usersGroupByInitialLetter[initialLetter]) {
        usersGroupByInitialLetter[initialLetter] = [];
      }
      usersGroupByInitialLetter[initialLetter].push(user);
    });
    
    return res.json({ msg: "Success", status: true, data: usersGroupByInitialLetter });
  } catch (error) {
    next(error);
  }
};

// export const generateToken = async (req, res, next) => {
//   try {
//     const appId = parseInt(process.env.ZEGO_APP_ID);
//     const serverSecret = process.env.ZEGO_SERVER_ID;
//     const userId = req.params.userId;
//     const effectiveTime = 3600;
//     const payload = "";
//     if(appId && serverSecret && userId) {
//       const token = await generateToken04(appId, userId, serverSecret, effectiveTime, payload);
//       return res.status(200).json({ token });
//     }
//     return res.status(400).send("User id, app id, and server secret is required");
//   } catch (error) {
//     next(error);
//   }
// };
