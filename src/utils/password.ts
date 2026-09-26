import bcrypt from "bcryptjs";

const saltRounds = 10;


export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw error;
    }
}

export const comparePassword = async (password : string , hash : string) : Promise<boolean> => {
    try {
        const checkPassword = await bcrypt.compare(password , hash);
        return checkPassword;

    } catch (error) {
        console.log(error)
        throw error
    }
}