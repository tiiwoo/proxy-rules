const { fetchWithRetry } = require("./lib/fetch-retry");
const fs = require("fs");
const path = require("path");

const { isDomainLoose } = require("./lib/is-domain-loose");

(async () => {
  console.time("Total Time - build-apple-conf");

  const res = (
    await (
      await fetchWithRetry(
        "https://raw.githubusercontent.com/geekdada/surge-list/master/surgio-snippet/apple.tpl"
      )
    ).text()
  )
    .split("\n")
    .map((line) => {
      if (line.startsWith("{%") || line.startsWith("# http")) {
        return null;
      } else if (line.endsWith("{{ default_rule }}")) {
        return line.replace("{{ default_rule }}", "🍎 Apple");
      } else if (line.endsWith("{{ api_rule }}")) {
        return line.replace("{{ api_rule }}", "🍎 Apple");
      } else if (line.endsWith("{{ cdn_rule }}")) {
        return line.replace("{{ cdn_rule }}", "🍎 Apple CDN");
      } else if (line.endsWith("{{ location_rule }}")) {
        return line.replace("{{ location_rule }}", "DIRECT");
      } else if (line.endsWith("{{ apple_news_rule }}")) {
        return line.replace("{{ apple_news_rule }}", "🍎 Apple");
      }

      return line;
    });
  // .filter((domain) => typeof domain === "string" && isDomainLoose(domain));

  // console.log(res);
  let ans = [];
  res.forEach((item) => {
    if (item !== null) {
      ans.push(item);
    }
  });
  // console.log(ans);
  await Promise.all([
    fs.promises.writeFile(
      path.resolve(__dirname, "../List/ruleset/apple.conf"),
      ans.map((domain) => domain).join("\n") + "\n",
      "utf-8"
    ),
  ]);

  console.timeEnd("Total Time - build-apple-conf");
})();
