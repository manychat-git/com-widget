import { Node } from './types';

// Функция для форматирования имени автора
const formatAuthorName = (author: string): string => {
  return author
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface InfoPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
}

const InfoPanel = ({ selectedNode, onClose }: InfoPanelProps) => {
  if (!selectedNode) return null;

  // Разделяем теги, если они есть
  const tags = selectedNode.tags ? selectedNode.tags.split(';').map(tag => tag.trim()) : [];

  return (
    <div className="com-fixed com-right-0 com-top-0 com-h-full com-w-80 com-bg-white/90 com-backdrop-blur-sm com-shadow-lg com-p-6 com-transform com-transition-transform com-duration-300 com-ease-in-out com-overflow-y-auto">
      <button
        onClick={onClose}
        className="com-absolute com-top-4 com-right-4 com-text-gray-500 hover:com-text-gray-700 com-text-xl"
      >
        ×
      </button>
      
      <div className="com-mt-8 com-space-y-4">
        {/* Теги и тип контента */}
        <div className="com-flex com-flex-wrap com-gap-2">
          {/* Тип контента */}
          <span className={`com-inline-block com-px-2 com-py-1 com-rounded-sm com-text-xs com-text-white com-font-medium cofo-sans-mono
            ${selectedNode.type === 'article' ? 'com-bg-[#0057FF]' : ''}
            ${selectedNode.type === 'youtube_video' ? 'com-bg-[#FD00FD]' : ''}
            ${selectedNode.type === 'special_project' ? 'com-bg-[#FF4B00]' : ''}
          `}>
            {selectedNode.type.toUpperCase()}
          </span>
          
          {/* Остальные теги */}
          {tags.length > 0 && tags.map((tag, index) => (
            <span
              key={index}
              className="com-inline-block com-px-2 com-py-1 com-bg-gray-800 com-text-white com-rounded-sm com-text-xs com-font-medium cofo-sans-mono"
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Изображение */}
        {selectedNode.imageUrl && (
          <img 
            src={selectedNode.imageUrl} 
            alt={selectedNode.title}
            className="com-rounded-lg com-shadow-sm com-w-full com-object-cover com-aspect-video com-mb-4"
          />
        )}

        {/* Заголовок */}
        <h2 className="com-text-xl com-font-semibold">{selectedNode.title}</h2>
        
        {/* Дескриптор */}
        {selectedNode.descriptor && (
          <div className="com-text-sm com-text-gray-500 cofo-sans-mono">
            {selectedNode.descriptor}
          </div>
        )}

        {/* Автор */}
        {selectedNode.author && (
          <div className="com-text-sm com-text-gray-600">
            by <span className="com-font-medium">{formatAuthorName(selectedNode.author)}</span>
          </div>
        )}
        
        {/* Описание */}
        {selectedNode.description && (
          <p className="com-text-gray-600 com-text-sm com-leading-relaxed">
            {selectedNode.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;