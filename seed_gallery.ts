import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  projectId: "plated-oarlock-8x6pd",
  storageBucket: "plated-oarlock-8x6pd.firebasestorage.app"
});

const fs = getFirestore(undefined, "ai-studio-c9a1470c-2330-4a89-87c2-db77182ec109");

async function seed() {
  const defaultImages = [
    { url: "/gabinet.jpg", caption: "Gabinet podologiczny" },
    { url: "/recepcja1.jpg", caption: "Nasza przestrzeń" },
    { url: "/recepcja2.jpg", caption: "Centrum szkoleniowe" },
  ];

  for (const img of defaultImages) {
    await fs.collection('gallery').add({
      ...img,
      createdAt: new Date().toISOString()
    });
    console.log("Added", img.url);
  }
  console.log("Done");
}

seed().catch(console.error);
