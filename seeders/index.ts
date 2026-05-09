import User from "./user";
import createCategories from "./category";


async function main() {
    await User();
    await createCategories();
}

main();