export default {
	tags: [
		"posts"
	],
	layout: "layouts/post.njk",
	eleventyComputed: {
		readingTime: (data) => {
			if (!data.page.rawInput) return "1 min read";
			const words = data.page.rawInput.split(/\s+/).length;
			const time = Math.ceil(words / 225) || 1;
			return `${time} min read`;
		}
	}
};
