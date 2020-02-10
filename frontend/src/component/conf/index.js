export const config = (initialValue, required) => ({
    initialValue,
    validate: [
        {
            trigger: "onChange",
            rules: [
                {
                    required: required,
                    message: "обязательное для заполнения"
                }
            ]
        }
    ]
});