import react from "@vitejs/plugin-react";

export default {
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/, // ✅ Allows both .jsx and .js files
  },
};
