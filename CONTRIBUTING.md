# 🤝 Contributing to MemoGarden

Thank you for your interest in contributing to MemoGarden! 🌱  
Your ideas, code, and feedback help grow a better, more creative platform for everyone.

---

## 🛠️ How to Contribute

### 1. **Get Started**

- **Fork the repository** and clone your fork:

git clone https://github.com/YOUR-USERNAME/memo-garden-verse.git
cd memo-garden-verse

text
- **Install dependencies**:

npm install

text
- **Set up environment variables**:  
Copy `.env.example` to `.env` and fill in your Supabase credentials.

- **Start the development server**:

npm run dev

text

---

### 2. **Ways to Contribute**

- **Report Bugs**  
Open an [issue](https://github.com/itsemtuk/memo-garden-verse/issues) with clear steps to reproduce.

- **Suggest Features or Improvements**  
Start a [discussion](https://github.com/itsemtuk/memo-garden-verse/discussions) or open an issue.

- **Submit Pull Requests**  
- Fork, branch, and commit your changes.
- Write clear commit messages.
- Add tests for new features or bug fixes.
- Run `npm run lint` and `npm run test` to ensure code quality.
- Open a pull request with a clear description of your changes.

- **Improve Documentation**  
- Update or add guides, widget docs, or code comments.

- **Design & UX**  
- Suggest UI tweaks, accessibility improvements, or new illustrations.

---

### 3. **Code Style & Guidelines**

- **Use TypeScript** for all code.
- **Follow the existing file structure** (see `/src/components`, `/src/hooks`, etc).
- **Use [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/)** for UI.
- **Write clear, descriptive commit messages**.
- **Add JSDoc or TypeScript types** for new components and hooks.
- **Keep components focused and under 200 lines if possible**.
- **Use Prettier and ESLint** for formatting and linting.

---

### 4. **Pull Request Checklist**

Before submitting, please ensure:

- [ ] Code builds and runs locally (`npm run dev`)
- [ ] No linting or type errors (`npm run lint`, `npm run typecheck`)
- [ ] New/updated components are tested
- [ ] Docs are updated if you added/changed features
- [ ] PR description explains **what** and **why**

---

### 5. **Adding a New Widget**

1. **Create your widget component** in `src/components/widgets/`.
2. **Register it** in `WidgetRegistry.tsx`.
3. **Add it to the Add Widget menu**.
4. **Document its usage** in `widgets.md`.
5. **Test** for drag, resize, rotate, and real-time sync.

See [Widget System Guide](./widgets.md) for details.

---

### 6. **Community Standards**

- Be respectful and constructive.
- Welcome new contributors and ideas.
- Follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## 💬 Questions?

- Open an [issue](https://github.com/itsemtuk/memo-garden-verse/issues)
- Start a [discussion](https://github.com/itsemtuk/memo-garden-verse/discussions)

---

Thank you for helping MemoGarden grow! 🌻
