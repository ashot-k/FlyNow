


export function capitalize(word: string | undefined) {
    if(word)
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}