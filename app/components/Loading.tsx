

export const LoadingSpin = ({ text }: { text: string }) => (
    <div className="flex items-center justify-center gap-2">
        <div className="animate-spin rounded-full w-5 h-5 border-3 border-gray-300 border-t-white"></div>
        {text}
    </div>
)