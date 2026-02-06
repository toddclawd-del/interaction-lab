// WebGPU Navigator extension
interface Navigator {
  gpu?: GPU
}

interface GPU {
  requestAdapter(): Promise<GPUAdapter | null>
}

interface GPUAdapter {
  // Add more properties as needed
}
