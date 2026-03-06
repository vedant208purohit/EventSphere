import jwt from 'jsonwebtoken';

const generateToken = (id: string): string => {
    const options: jwt.SignOptions = {
        expiresIn: (process.env.JWT_EXPIRE || '7d') as any,
    };
    return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

export default generateToken;
