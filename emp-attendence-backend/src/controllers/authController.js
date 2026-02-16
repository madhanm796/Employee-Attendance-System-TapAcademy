const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validEmail = require('../utils/misc');

const generateEmployeeId = async () => {
    const lastUser = await User.findOne({}, { employeeId: 1 }).sort({ employeeId: -1 });

    if (!lastUser || !lastUser.employeeId) {
        return 'EMP001';
    }

    const lastIdString = lastUser.employeeId.replace('EMP', '');
    const lastIdNum = parseInt(lastIdString, 10);

    const nextIdNum = lastIdNum + 1;
    const nextIdString = nextIdNum.toString().padStart(3, '0');

    return `EMP${nextIdString}`;
};
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {

    try {
        if (!req.body?.name || !req.body?.email || !req.body?.password || !req.body?.role
            || !req.body.department
        ) {
            return res.status(401).json({ message: "All fields are required!" });
        }
        const { name, email, password, role, department } = req.body;
        const employeeId = await generateEmployeeId();

        if (!validEmail(email)) {
            return res.status(422).json({ message: "Invalid email format." });
        }

        const userExists = await User.findOne({
            $or: [{ email }, { employeeId }]
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists (email or Employee ID)' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            employeeId,
            department
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error A', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {

        if (!req.body?.email || !req.body?.password) {
            return res.status(401).json({ message: "Email and Password are required!" });
        }
        const { email, password } = req.body;

        if (!validEmail(email)) {
            return res.status(401).json({ message: "Invalid Email format" });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                employeeId: user.employeeId,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

