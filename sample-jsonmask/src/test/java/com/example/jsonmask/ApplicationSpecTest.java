package com.example.jsonmask;

import java.io.IOException;
import java.util.Collection;

import org.junit.Test;
import org.junit.runners.Parameterized.Parameters;
import org.springframework.boot.test.SpringApplicationConfiguration;

@SpringApplicationConfiguration(classes = com.example.jsonmask.Application.class)
public class ApplicationSpecTest extends io.pivotal.pcfms.nashorn.test.ApplicationSpecTest {

	public ApplicationSpecTest(String specName, String specFile) {
        super(specName, specFile);
    }
	
	@Parameters(name = "{0}")
    public static Collection<Object[]> getParameters() throws IOException {
        return io.pivotal.pcfms.nashorn.test.ApplicationSpecTest.getParameters("spec");
    }

    @Test
    public void testSpecFiles() throws Exception {
        super.testSpecFiles();
    }
}
