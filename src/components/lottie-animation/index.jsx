import Lottie from 'react-lottie';

const AnimationComponent = ({ data, height, width }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={height ? height : 100} width={width ? width : 100} />
    </div>
  );
};

export default AnimationComponent;
