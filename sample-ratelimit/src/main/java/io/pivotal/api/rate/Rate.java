package io.pivotal.api.rate;

public class Rate {
	
	private String key;
	private Integer value;
	private Integer current;
	private Long reset;
	private Integer window;
	
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public Integer getValue() {
		return value;
	}
	public void setValue(Integer value) {
		this.value = value;
	}
	public Integer getCurrent() {
		return current;
	}
	public void setCurrent(Integer current) {
		this.current = current;
	}
	public Long getReset() {
		return reset;
	}
	public void setReset(Long reset) {
		this.reset = reset;
	}
	public Integer getWindow() {
		return window;
	}
	public void setWindow(Integer window) {
		this.window = window;
	}
	@Override
	public String toString() {
		return "Rate [key=" + key + ", value=" + value + ", current=" + current + ", reset=" + reset + ", window=" + window + "]";
	}
	
}
