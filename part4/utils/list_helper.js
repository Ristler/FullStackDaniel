const dummy = (blogs) => {
    return 1;

}
const totalLikes = (blogs) => {
    let total = blogs.reduce((total, blog) => {
        return total + blog.likes

    }, 0)
}
module.exports = {
    dummy,
    totalLikes
}