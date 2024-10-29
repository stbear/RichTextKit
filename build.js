var bt = require('./buildtools/buildTools.js')

if (bt.options.official)
{
    // Check everything committed
    bt.git_check();

    // Clock version
    bt.clock_version();

    // Clean build directory
    bt.run("rm -rf ./Build");
}

// Build
bt.run("dotnet build Topten.RichTextKit -c Release")

if (bt.options.official)
{
    // Run tests
    bt.run("dotnet test Topten.RichTextKit.Test -c Release");

    // Build docs
    //if (!bt.options.nodoc)
    //{
    //    bt.run(`docsanity-net5`);
    //    bt.run(`git add doc`);
    //    bt.run(`git commit --allow-empty -m "Updated documentation"`);
    //}

    // Tag and commit
    bt.git_tag();

    // Push nuget package
    //var pushTo = bt.options.version.suffix ? "\"Topten GitHub\"" : "\"nuget.org\"";
    var pushTo = "\"nuget.org\"";
    bt.run(`dotnet nuget push`,
           `.\\Build\\Release\\*.${bt.options.version.build}${bt.options.version.suffix}.nupkg`,
           `--source ${pushTo}`);
}


