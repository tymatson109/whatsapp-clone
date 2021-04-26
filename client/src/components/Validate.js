export const validate = (input) => {
    const one = input.replace('&', "&amp")
    const two = one.replace("<", "&lt")
    const three = two.replace(">", "&gt")
    const four = three.replace('"', "&quot")
    const five = four.replace("'", "&#x27")
    const six = five.replace("/", "&#x2F")
    return six;
}
