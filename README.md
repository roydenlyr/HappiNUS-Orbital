# HappiNUS

**Level of Achievement:** Apollo 11 🚀

---

## 📌 Project Scope

**One-sentence version:**  
An anonymous peer-to-peer support platform that connects NUS students with trained peer mentors to foster mental well-being without stigma.

**Descriptive version:**  
**HappiNUS** is an application-based platform aimed at providing accessible and confidential mental health support within university residences. Prompted by recent suicide attempts in Prince George's Park Residences and informed by our experience as peer mentors, we identified a critical gap in existing support systems—primarily, the fear of being judged. HappiNUS empowers students to seek help anonymously, allowing them to connect with peer mentors through secure, stigma-free communication. Core features include AI-assisted chat summarisation, emergency alert broadcasting, and privacy-enhancing chat controls. We envision starting with LightHouse and eventually extending to the entire NUS campus community.

---

## 🚀 Milestone 1: Ideation

### 🔍 Problem Motivation
Recent mental health incidents at Prince George's Park Residences underscore the need for accessible, stigma-free support. As peer mentors ourselves, we’ve seen how concerns over confidentiality deter students from using existing resources. HappiNUS aims to remove this barrier by enabling anonymous, emotionally safe conversations between students and peer mentors.

### 💡 Proposed Core Features / User Stories

#### 👨‍🎓 Students
- Select peer mentors based on faculty, year, gender, and other preferences.
- Initiate fully anonymous chats with a chosen peer mentor.
- Access curated external resources for mental health support.

#### 🤝 Peer Mentors
- Offer moral and emotional support through real-time chat.
- Review previous chats using a summarisation tool.
- Seamlessly transfer conversations to another mentor (with student consent).
- Trigger **Red Alert** notifications to mobilize support in emergencies.
- Receive AI-suggested responses to enhance emotional communication.

#### 🛠 Administrators
- Manage mentor accounts (add/remove).

---

## ⚙️ Getting Started

### Prerequisites
- Ensure [Node.js](https://nodejs.org/) and [Expo CLI](https://docs.expo.dev/get-started/installation/) are installed.

### Setup Instructions

Clone the repository:

```bash
git clone https://github.com/your-username/HappiNUS.git
cd HappiNUS
npx expo start
```

---

## 👥 How to Use the App

### 🔐 Admin Access
An admin account has already been created for demonstration purposes:

- **Email:** `admin@gmail.com`  
- **Password:** `123456`

#### ➕ Adding a Mentor
1. Log in using the admin credentials.
2. Navigate to the **Admin Dashboard**.
3. Use the interface to add a new mentor by filling in the required details.
4. Once added, the mentor will appear in the student-facing chat selection view.

---

### 🧑‍🎓 Student Flow
1. Sign up for a new student account via the **Sign Up** page.
2. After logging in, go to the **Chat** tab.
3. You will see a list of available mentors (including the one created by the admin).
4. Click the **chat bubble icon** on a mentor’s profile card.
5. This will open a dedicated chatroom where you can begin your conversation anonymously with the selected mentor.

---

### 🧑‍🏫 Mentor Flow
1. Log in using the credentials of a mentor account (created by the admin).
2. After signing in, navigate to the **Chat** tab.
3. You will see conversations initiated by student users.
4. Select a conversation to begin providing support.
