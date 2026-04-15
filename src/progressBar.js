import { todos } from "./todoStore";

const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const progressContainer = document.querySelector('.progress-container');
function updateProgressBar() {
    if (todos.length === 0) {
        progressFill.style.width = '0%';
        progressPercent.textContent = '0%';
        progressContainer.style.opacity = '0.5';
        return;
    }


    const completedCount = todos.filter(t => t.completed).length;
    const percentage = Math.round((completedCount / todos.length) * 100);

    progressFill.style.width = `${percentage}%`;
    progressPercent.textContent = `${percentage}%`;
}
export default updateProgressBar;