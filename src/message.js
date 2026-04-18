export function collapseMessage(element, text, limit = 20) {
    if (!text) return;

    if (text.length <= limit) {
        element.textContent = text;
        return;
    }

    const truncated = text.slice(0, limit) + "...";
    let isExpanded = false;

    const updateDisplay = () => {
        element.dataset.testid = "test-todo-collapsible-section";
        element.innerHTML = `
            ${isExpanded ? text : truncated}
            <button data-testid="test-todo-expand-toggle" class="toggle-text-btn" style="
                background: none;
                border: none;
                color: var(--primary);
                cursor: pointer;
                font-size: 0.8rem;
                font-weight: 600;
                margin-left: 5px;
                padding: 0;
            ">
                ${isExpanded ? 'Show Less' : 'Show More'}
            </button>
        `;

        const btn = element.querySelector('.toggle-text-btn');
        if (btn) {
            btn.onclick = (e) => {
                e.stopPropagation();
                isExpanded = !isExpanded;
                updateDisplay();
            };
        }
    };

    updateDisplay();
}
