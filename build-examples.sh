rm -rf public/is

cd examples/react-router-project

BASENAME=/is/react-router-project npm run build
mkdir -p ../../public/is/react-router-project
mv dist/* ../../public/is/react-router-project

cd ../remix-project

BASENAME=/is/remix-project npm run build
mkdir -p ../../public/is/remix-project
mv build/client/* ../../public/is/remix-project
BASENAME=/is/remix-project/preview npm run build
mkdir -p ../../public/is/remix-project/preview
mv build/client/* ../../public/is/remix-project/preview
BASENAME=/is/remix-project/example.com npm run build
mkdir -p ../../public/is/remix-project/example.com
mv build/client/* ../../public/is/remix-project/example.com
BASENAME=/is/remix-project/acme.com npm run build
mkdir -p ../../public/is/remix-project/acme.com
mv build/client/* ../../public/is/remix-project/acme.com

cd ../vite-project

BASENAME=/is/vite-project npm run build
mkdir -p ../../public/is/vite-project
mv dist/* ../../public/is/vite-project
BASENAME=/is/vite-project/preview npm run build
mkdir -p ../../public/is/vite-project/preview
mv dist/* ../../public/is/vite-project/preview
BASENAME=/is/vite-project/example.com npm run build
mkdir -p ../../public/is/vite-project/example.com
mv dist/* ../../public/is/vite-project/example.com
BASENAME=/is/vite-project/acme.com npm run build
mkdir -p ../../public/is/vite-project/acme.com
mv dist/* ../../public/is/vite-project/acme.com