import { DateTime } from "luxon";

export default function(eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) return [];
		if( n < 0 ) return array.slice(n);
		return array.slice(0, n);
	});

	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter("sortAlphabetically", strings =>
		(strings || []).sort((b, a) => b.localeCompare(a))
	);

    // Calculate reading time
    eleventyConfig.addFilter("readingTime", (content) => {
        if (!content) return "1 min read";
        const wpm = 225;
        const text = content.replace(/(<([^>]+)>)/gi, "");
        const words = text.split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        return `${time} min read`;
    });
};
