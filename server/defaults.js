export const getDefaults = () => {
    const lockUnit = process.env.NEXT_PUBLIC_LESSON_LOCK_ASSET_UNIT || "lovelace";
    const lockAmount = parseInt(process.env.NEXT_PUBLIC_LESSON_LOCK_LOVELACE_AMOUNT || "10000000");
    if (lockAmount <= 0) {
        throw new Error("Invalid lesson lock lovelace amount configured");
    }
    const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
    if (!adminAddress) {
        throw new Error("Admin address is not configured");
    }
    return {
        lockUnit,
        lockAmount,
        adminAddress
    };
}